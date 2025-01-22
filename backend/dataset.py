import pandas as pd
import numpy as np
import logging
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import joblib

# Enhanced logging configuration
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('crop_recommendation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class CropRecommendationPreprocessor:
    def __init__(self, dataset_path):
        """
        Initialize the preprocessor with the dataset path
        
        Args:
            dataset_path (str): Path to the JSON dataset
        """
        self.dataset_path = dataset_path
        self.data = None
        self.features = None
        self.X = None
        self.y = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
    
    def load_data(self):
        """
        Load and validate the dataset
        """
        try:
            # Read JSON dataset
            self.data = pd.read_json(self.dataset_path)
            
            # Convert numeric columns from string to float
            numeric_columns = ['land', 'temperature', 'humidity', 
                               'rainfall', 'ph', 'water_requirement',
                               'nitrogen', 'phosphorus', 'potassium']
            
            for col in numeric_columns:
                if col in self.data.columns:
                    self.data[col] = pd.to_numeric(self.data[col], errors='coerce')
            
            logger.info(f"Dataset loaded successfully: {self.dataset_path}")
            logger.info(f"Dataset shape: {self.data.shape}")
            logger.info(f"Available columns: {self.data.columns.tolist()}")
            
        except FileNotFoundError:
            logger.error("Dataset file not found")
            raise
    
    def feature_engineering(self):
        """
        Create additional features and perform feature engineering
        Handles potential column name variations
        """
        # Flexible column name matching
        def find_column(pattern):
            matches = [col for col in self.data.columns if pattern.lower() in col.lower()]
            return matches[0] if matches else None
        
        # Find columns dynamically
        nitrogen_col = find_column('nitrogen')
        phosphorus_col = find_column('phosphorus')
        potassium_col = find_column('potassium')
        temp_col = find_column('temperature')
        humidity_col = find_column('humidity')
        rainfall_col = find_column('rainfall')
        water_req_col = find_column('water')
        land_col = find_column('land')
        budget_col = find_column('budget')
        crop_col = find_column('crop')
        
        # Validate critical columns are found
        if not all([nitrogen_col, phosphorus_col, potassium_col, 
                    temp_col, humidity_col, rainfall_col, 
                    water_req_col, land_col, budget_col, crop_col]):
            logger.error("Missing critical columns. Please check your dataset.")
            raise ValueError("Essential columns not found in the dataset")
        
        # Calculate nutrient balance ratio
        try:
            self.data['nutrient_balance_ratio'] = (
                self.data[nitrogen_col] + 
                self.data[phosphorus_col] + 
                self.data[potassium_col]
            ) / 3
        except Exception as e:
            logger.error(f"Error calculating nutrient balance ratio: {e}")
            self.data['nutrient_balance_ratio'] = 0
        
        # Temperature and humidity interaction feature
        try:
            self.data['temp_humidity_stress'] = (
                self.data[temp_col] / 
                (self.data[humidity_col] + 1)  # Avoid division by zero
            )
        except Exception as e:
            logger.error(f"Error calculating temp-humidity stress: {e}")
            self.data['temp_humidity_stress'] = 0
        
        # Water stress index
        try:
            self.data['water_stress_index'] = (
                self.data[rainfall_col] / 
                (self.data[water_req_col] + 1)  # Avoid division by zero
            )
        except Exception as e:
            logger.error(f"Error calculating water stress index: {e}")
            self.data['water_stress_index'] = 0
        
        logger.info("Feature engineering completed")
    
    def prepare_features(self):
        """
        Select and prepare features for model training
        Uses dynamic column finding
        """
        # Flexible column finding
        def find_column(pattern):
            matches = [col for col in self.data.columns if pattern.lower() in col.lower()]
            return matches[0] if matches else None
        
        # Dynamically find columns
        features_to_use = [
            find_column('temperature'),
            find_column('humidity'),
            find_column('ph'),
            find_column('rainfall'),
            find_column('land'),
            find_column('budget'),
            find_column('nitrogen'),
            find_column('phosphorus'),
            find_column('potassium'),
            'nutrient_balance_ratio',
            'temp_humidity_stress', 
            'water_stress_index'
        ]
        
        # Remove any None values
        self.features = [f for f in features_to_use if f is not None]
        
        # Handle missing values
        self.X = self.data[self.features]
        crop_col = find_column('crop')
        self.y = self.data[crop_col]
        
        if self.X.isnull().any().any():
            logger.warning("Missing values detected. Imputing with mean.")
            self.X = self.X.fillna(self.X.mean())
    
    def preprocess_data(self, test_size=0.2, random_state=42):
        """
        Split and preprocess data with handling for small sample sizes
        """
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            self.X, self.y, 
            test_size=test_size, 
            random_state=random_state,
            shuffle=True
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Check class distribution
        class_counts = pd.Series(y_train).value_counts()
        min_samples = class_counts.min()
        
        # Only apply SMOTE if we have enough samples
        if min_samples >= 6:
            smote = SMOTE(random_state=random_state)
            X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)
        else:
            # For small datasets, use simple random oversampling
            logger.warning(f"Small sample size detected (min={min_samples}). Using random oversampling.")
            from imblearn.over_sampling import RandomOverSampler
            ros = RandomOverSampler(random_state=random_state)
            X_train_balanced, y_train_balanced = ros.fit_resample(X_train_scaled, y_train)
        
        return X_train_balanced, y_train_balanced, X_test_scaled, y_test
    
    def train_model(self, X_train, y_train):
        """
        Train model with adjusted cross-validation for small datasets
        """
        try:
            # Calculate minimum samples per class
            class_counts = pd.Series(y_train).value_counts()
            min_samples = class_counts.min()
            
            # Adjust cross-validation splits based on minimum samples
            n_splits = min(3, min_samples)  # Use max 3 splits or fewer if needed
            logger.info(f"Using {n_splits}-fold cross-validation due to sample size")
            
            # Define parameter grid
            param_grid = {
                'n_neighbors': [3, 5],  # Reduced parameter space
                'weights': ['uniform', 'distance']
            }
            
            # Configure GridSearchCV with reduced splits
            grid_search = GridSearchCV(
                KNeighborsClassifier(),
                param_grid,
                cv=n_splits,
                scoring='accuracy',
                n_jobs=-1
            )
            
            # Fit model
            grid_search.fit(X_train, y_train)
            logger.info(f"Best parameters found: {grid_search.best_params_}")
            
            return grid_search.best_estimator_
            
        except Exception as e:
            logger.error(f"Error during model training: {str(e)}")
            raise
    
    def evaluate_model(self, model, X_test, y_test):
        """
        Evaluate model performance
        """
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"Model Accuracy: {accuracy:.2f}")
        logger.info("\nClassification Report:\n" + 
                    classification_report(y_test, y_pred, zero_division=1))
    
    def save_artifacts(self, model, filename_prefix='crop_recommendation'):
        """
        Save preprocessing and model artifacts
        """
        artifacts = {
            'scaler': self.scaler,
            'model': model,
            'features': self.features
        }
        
        for name, artifact in artifacts.items():
            filename = f'pkl/{filename_prefix}_{name}.pkl'
            joblib.dump(artifact, filename)
            logger.info(f"Saved {name} to {filename}")
    
    def run_pipeline(self):
        """
        Run the entire preprocessing and training pipeline
        """
        self.load_data()
        self.feature_engineering()
        self.prepare_features()
        
        # Preprocess and train
        X_train, y_train, X_test, y_test = self.preprocess_data()
        model = self.train_model(X_train, y_train)
        
        # Evaluate and save
        self.evaluate_model(model, X_test, y_test)
        self.save_artifacts(model)

def main():
    preprocessor = CropRecommendationPreprocessor('datasets/dataset.json')
    preprocessor.run_pipeline()

if __name__ == '__main__':
    main()
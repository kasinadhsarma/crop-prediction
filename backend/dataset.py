import pandas as pd
import numpy as np
import logging
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import joblib
import json

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
        self.dataset_path = dataset_path
        self.data = None
        self.features = None
        self.X = None
        self.y = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.soil_type_encoder = LabelEncoder()
        
        # Define valid ranges for features
        self.valid_ranges = {
            'temperature': (-50, 50),
            'humidity': (0, 100),
            'rainfall': (0, 5000),
            'ph': (0, 14),
            'nitrogen': (0, 300),
            'phosphorus': (0, 300),
            'potassium': (0, 300),
            'water_requirement': (0, 10000)
        }
    
    def load_data(self):
        """Load and validate the dataset with enhanced error handling"""
        try:
            file_extension = self.dataset_path.split('.')[-1].lower()
            
            if file_extension == 'json':
                self.data = pd.read_json(self.dataset_path)
            elif file_extension == 'csv':
                self.data = pd.read_csv(self.dataset_path, sep='\t')
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
            
            # Standardize column names
            self.data.columns = self.data.columns.str.lower().str.strip()
            
            # Convert numeric columns
            numeric_columns = [
                'land', 'temperature', 'humidity', 'rainfall', 'ph', 
                'water_requirement', 'nitrogen', 'phosphorus', 'potassium'
            ]
            
            for col in numeric_columns:
                if col in self.data.columns:
                    self.data[col] = pd.to_numeric(self.data[col], errors='coerce')
                    
                    # Validate ranges
                    if col in self.valid_ranges:
                        min_val, max_val = self.valid_ranges[col]
                        invalid_mask = (self.data[col] < min_val) | (self.data[col] > max_val)
                        if invalid_mask.any():
                            logger.warning(f"Found {invalid_mask.sum()} invalid values in {col}")
                            # Replace invalid values with median of valid values
                            valid_median = self.data.loc[~invalid_mask, col].median()
                            self.data.loc[invalid_mask, col] = valid_median
            
            # Encode soil type
            if 'soil_type' in self.data.columns:
                self.data['soil_type'] = self.soil_type_encoder.fit_transform(self.data['soil_type'])
                joblib.dump(self.soil_type_encoder, 'pkl/soil_type_encoder.pkl')
                logger.info(f"Soil type categories: {list(self.soil_type_encoder.classes_)}")
            
            logger.info(f"Dataset loaded successfully: {self.dataset_path}")
            logger.info(f"Dataset shape: {self.data.shape}")
            logger.info(f"Available columns: {self.data.columns.tolist()}")
            
        except Exception as e:
            logger.error(f"Error loading dataset: {str(e)}")
            raise
    
    def feature_engineering(self):
        """Enhanced feature engineering with error handling"""
        def find_column(pattern):
            matches = [col for col in self.data.columns if pattern.lower() in col.lower()]
            return matches[0] if matches else None

        # Find columns dynamically
        required_cols = {
            'nitrogen': find_column('nitrogen'),
            'phosphorus': find_column('phosphorus'),
            'potassium': find_column('potassium'),
            'temperature': find_column('temperature'),
            'humidity': find_column('humidity'),
            'rainfall': find_column('rainfall'),
            'water': find_column('water'),
            'ph': find_column('ph')
        }

        missing_cols = [k for k, v in required_cols.items() if v is None]
        if missing_cols:
            raise ValueError(f"Missing critical columns: {', '.join(missing_cols)}")

        try:
            # NPK ratio
            self.data['npk_ratio'] = (
                self.data[required_cols['nitrogen']] / 
                (self.data[required_cols['phosphorus']] + self.data[required_cols['potassium']])
            ).fillna(0)
            
            # Temperature-humidity index
            self.data['temp_humidity_index'] = (
                0.8 * self.data[required_cols['temperature']] + 
                (self.data[required_cols['humidity']] / 100) * 
                (self.data[required_cols['temperature']] - 14.4)
            )
            
            # Water sufficiency ratio
            self.data['water_sufficiency'] = (
                self.data[required_cols['rainfall']] / 
                self.data[required_cols['water']].replace(0, 1)
            ).clip(0, 1)
            
            # pH balance indicator
            optimal_ph = 7.0
            self.data['ph_balance'] = (
                -(self.data[required_cols['ph']] - optimal_ph).abs() + 7
            ).clip(0, 7)
            
        except Exception as e:
            logger.error(f"Error in feature engineering: {str(e)}")
            raise
            
        logger.info("Feature engineering completed successfully")
    
    def prepare_features(self):
        """Prepare features with enhanced validation"""
        base_features = [
            'temperature', 'humidity', 'rainfall', 'ph', 'nitrogen',
            'phosphorus', 'potassium', 'soil_type'
        ]
        
        engineered_features = [
            'npk_ratio', 'temp_humidity_index', 
            'water_sufficiency', 'ph_balance'
        ]
        
        self.features = base_features + engineered_features
        
        # Validate all required features exist
        missing_features = [f for f in self.features if f not in self.data.columns]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")
        
        self.X = self.data[self.features]
        crop_col = [col for col in self.data.columns if 'crop' in col.lower()][0]
        self.y = self.data[crop_col]
        
        # Handle missing values with median imputation
        for col in self.X.columns:
            if self.X[col].isnull().any():
                median_val = self.X[col].median()
                self.X[col] = self.X[col].fillna(median_val)
                logger.warning(f"Imputed {self.X[col].isnull().sum()} missing values in {col}")
    
    def preprocess_data(self, test_size=0.2, random_state=42):
        """Enhanced data preprocessing with validation"""
        # Define crop column
        crop_col = [col for col in self.data.columns if 'crop' in col.lower()][0]

        # Ensure each class has at least 2 samples
        class_counts = self.y.value_counts()
        rare_classes = class_counts[class_counts < 2].index
        if not rare_classes.empty:
            logger.warning(f"Classes with fewer than 2 samples: {list(rare_classes)}")
            self.data = self.data[~self.data[crop_col].isin(rare_classes)]
            self.X = self.data[self.features]
            self.y = self.data[crop_col]

        X_train, X_test, y_train, y_test = train_test_split(
            self.X, self.y,
            test_size=test_size,
            random_state=random_state,
            stratify=self.y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Apply SMOTE for better class balance
        try:
            smote = SMOTE(random_state=random_state)
            X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)
            logger.info("Successfully applied SMOTE balancing")
        except ValueError as e:
            logger.warning(f"SMOTE failed, using original data: {str(e)}")
            X_train_balanced, y_train_balanced = X_train_scaled, y_train
        
        return X_train_balanced, y_train_balanced, X_test_scaled, y_test
    
    def train_model(self, X_train, y_train):
        """Enhanced model training with cross-validation"""
        param_grid = {
            'n_neighbors': [3, 5, 7],
            'weights': ['uniform', 'distance'],
            'metric': ['euclidean', 'manhattan']
        }
        
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        
        grid_search = GridSearchCV(
            KNeighborsClassifier(),
            param_grid,
            cv=cv,
            scoring='accuracy',
            n_jobs=-1
        )
        
        grid_search.fit(X_train, y_train)
        
        logger.info(f"Best parameters: {grid_search.best_params_}")
        logger.info(f"Best cross-validation score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def save_artifacts(self, model, filename_prefix='crop_recommendation'):
        """Save model artifacts and feature information"""
        artifacts = {
            'scaler': self.scaler,
            'model': model,
            'features': self.features,
            'valid_ranges': self.valid_ranges
        }
        
        for name, artifact in artifacts.items():
            filename = f'pkl/{filename_prefix}_{name}.pkl'
            joblib.dump(artifact, filename)
            logger.info(f"Saved {name} to {filename}")
        
        # Save feature metadata as JSON for frontend validation
        feature_metadata = {
            'features': self.features,
            'valid_ranges': self.valid_ranges,
            'soil_types': list(self.soil_type_encoder.classes_)
        }
        
        with open('pkl/feature_metadata.json', 'w') as f:
            json.dump(feature_metadata, f, indent=2)
            logger.info("Saved feature metadata to pkl/feature_metadata.json")

def main():
    preprocessor = CropRecommendationPreprocessor('backend/datasets/newdataset.csv')
    try:
        preprocessor.load_data()
        preprocessor.feature_engineering()
        preprocessor.prepare_features()
        
        X_train, y_train, X_test, y_test = preprocessor.preprocess_data()
        model = preprocessor.train_model(X_train, y_train)
        
        # Final evaluation
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        logger.info(f"\nModel Accuracy: {accuracy:.4f}")
        logger.info("\nClassification Report:\n" + classification_report(y_test, y_pred))
        
        preprocessor.save_artifacts(model)
        logger.info("Pipeline completed successfully")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {str(e)}")
        raise

if __name__ == '__main__':
    main()

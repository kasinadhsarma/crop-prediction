import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib
import json
import logging
from typing import Dict, Tuple, Any
import warnings
warnings.filterwarnings('ignore')

class AdvancedCropRecommender:
    def __init__(self, data_path: str):
        self.data_path = data_path
        self.setup_logging()
        self.initialize_encoders()
        self.load_data()
        
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('advanced_crop_training.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def initialize_encoders(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.soil_encoder = LabelEncoder()
        
    def load_data(self):
        try:
            self.df = pd.read_csv(self.data_path, delimiter='\t')
            self.logger.info(f"Data loaded successfully: {self.df.shape}")
        except Exception as e:
            self.logger.error(f"Error loading data: {str(e)}")
            raise
            
    def create_advanced_features(self) -> None:
        """Create advanced agricultural features"""
        try:
            # NPK Interaction Score
            self.df['npk_interaction'] = (
                (self.df['nitrogen'] * self.df['phosphorus'] * self.df['potassium']) ** (1/3)
            )
            
            # Water Stress Index
            self.df['water_stress_index'] = (
                (self.df['rainfall'] / self.df['water_requirement']).clip(0, 2)
            )
            
            # Soil Health Score
            optimal_ph = 7.0
            self.df['soil_health_score'] = (
                10 - (self.df['ph'] - optimal_ph).abs() + 
                (self.df['nitrogen'] / 150) + 
                (self.df['phosphorus'] / 75) + 
                (self.df['potassium'] / 100)
            ).clip(0, 10)
            
            # Climate Suitability Index
            self.df['climate_index'] = (
                (self.df['temperature'] - 20).abs() / 10 + 
                (self.df['humidity'] - 60).abs() / 20
            ).clip(0, 1)
            
            self.logger.info("Advanced features created successfully")
        except Exception as e:
            self.logger.error(f"Error in feature engineering: {str(e)}")
            raise
            
    def prepare_training_data(self) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare data for training with advanced feature selection"""
        try:
            # Encode categorical variables
            self.df['soil_type'] = self.soil_encoder.fit_transform(self.df['soil_type'])
            
            # Select features for training
            feature_columns = [
                'land', 'temperature', 'humidity', 'rainfall', 
                'soil_type', 'ph', 'nitrogen', 'phosphorus', 'potassium',
                'npk_interaction', 'water_stress_index', 
                'soil_health_score', 'climate_index'
            ]
            
            X = self.df[feature_columns]
            y = self.label_encoder.fit_transform(self.df['suggested_crop'])
            
            return X, y
            
        except Exception as e:
            self.logger.error(f"Error preparing training data: {str(e)}")
            raise
            
    def create_advanced_pipeline(self) -> Pipeline:
        """Create an advanced ML pipeline with SMOTE and KNN"""
        return Pipeline([
            ('scaler', StandardScaler()),
            ('smote', SMOTE(random_state=42)),
            ('knn', KNeighborsClassifier())
        ])
        
    def train_model(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """Train model with extensive hyperparameter tuning"""
        try:
            # Ensure y is a numpy array
            y = np.array(y)

            # Check the unique classes and their counts
            unique, counts = np.unique(y, return_counts=True)
            class_distribution = dict(zip(unique, counts))
            print("Class distribution:", class_distribution)

            # Split data with stratification
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )

            # Define parameter grid
            param_grid = {
                'knn__n_neighbors': [3, 5, 7, 9],
                'knn__weights': ['uniform', 'distance'],
                'knn__metric': ['euclidean', 'manhattan', 'minkowski'],
                'knn__p': [1, 2]
            }

            # Create and train GridSearchCV
            pipeline = self.create_advanced_pipeline()
            grid_search = GridSearchCV(
                pipeline, param_grid, cv=5, scoring='accuracy', n_jobs=-1
            )
            grid_search.fit(X_train, y_train)

            # Evaluate model
            y_pred = grid_search.predict(X_test)

            results = {
                'model': grid_search.best_estimator_,
                'best_params': grid_search.best_params_,
                'accuracy': accuracy_score(y_test, y_pred),
                'classification_report': classification_report(y_test, y_pred),
                'confusion_matrix': confusion_matrix(y_test, y_pred)
            }

            self.logger.info(f"Best parameters: {results['best_params']}")
            self.logger.info(f"Model accuracy: {results['accuracy']:.4f}")

            return results

        except Exception as e:
            self.logger.error(f"Error training model: {str(e)}")
            raise

    def save_artifacts(self, model: Any) -> None:
        """Save all necessary artifacts for production"""
        try:
            artifacts = {
                'model': model,
                'scaler': self.scaler,
                'label_encoder': self.label_encoder,
                'soil_encoder': self.soil_encoder,
                'feature_metadata': {
                    'soil_types': list(self.soil_encoder.classes_),
                    'crop_types': list(self.label_encoder.classes_),
                    'features': [
                        'land', 'temperature', 'humidity', 'rainfall', 
                        'soil_type', 'ph', 'nitrogen', 'phosphorus', 'potassium',
                        'npk_interaction', 'water_stress_index', 
                        'soil_health_score', 'climate_index'
                    ]
                }
            }

            # Save artifacts
            for name, artifact in artifacts.items():
                filename = f'pkl/advanced_crop_{name}.pkl'
                joblib.dump(artifact, filename)
                self.logger.info(f"Saved {name} to {filename}")

        except Exception as e:
            self.logger.error(f"Error saving artifacts: {str(e)}")
            raise

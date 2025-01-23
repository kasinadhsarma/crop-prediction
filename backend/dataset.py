import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import json
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CropModelTrainer:
    def __init__(self):
        self.csv_path = 'backend/datasets/newdataset.csv'
        self.models_dir = 'models'
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)

    def load_and_preprocess_data(self):
        try:
            # Read CSV with column parsing
            df = pd.read_csv(self.csv_path)
            
            # Parse the single column that contains all data
            if len(df.columns) == 1:
                column_name = df.columns[0]
                # Split the single column into multiple columns
                df = df[column_name].str.split('\t', expand=True)
                df.columns = [
                    'field_id', 'land', 'temperature', 'humidity', 'rainfall',
                    'budget', 'soil_type', 'ph', 'water_requirement',
                    'suggested_crop', 'suggested_fertilizers', 'suggested_pesticides',
                    'potential_diseases', 'nitrogen', 'phosphorus', 'potassium',
                    'estimated_yield'
                ]
            
            # Convert numeric columns
            numeric_columns = ['land', 'temperature', 'humidity', 'rainfall', 
                             'budget', 'ph', 'water_requirement', 'nitrogen',
                             'phosphorus', 'potassium', 'estimated_yield']
            for col in numeric_columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

            logger.info(f"Processed dataset shape: {df.shape}")
            
            features = [
                'temperature', 'humidity', 'rainfall', 'ph',
                'nitrogen', 'phosphorus', 'potassium',
                'land', 'budget'
            ]
            
            df['soil_type_encoded'] = (df['soil_type'].str.strip().str.lower() == 'clay').astype(int)
            features.append('soil_type_encoded')
            
            X = df[features]
            y = df['suggested_crop'].str.strip()
            
            y_encoded = self.label_encoder.fit_transform(y)
            
            return train_test_split(X, y_encoded, test_size=0.2, random_state=42)

        except Exception as e:
            logger.error(f"Error in data preprocessing: {str(e)}")
            raise

    def train_and_save(self):
        try:
            X_train, X_test, y_train, y_test = self.load_and_preprocess_data()
            
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            self.model.fit(X_train_scaled, y_train)
            
            y_pred = self.model.predict(X_test_scaled)
            logger.info("\nModel Performance:")
            logger.info(classification_report(y_test, y_pred))
            
            os.makedirs(self.models_dir, exist_ok=True)
            joblib.dump(self.scaler, os.path.join(self.models_dir, 'crop_scaler.pkl'))
            joblib.dump(self.model, os.path.join(self.models_dir, 'crop_model.pkl'))
            
            # Save label encoder classes
            with open(os.path.join(self.models_dir, 'label_encoder.json'), 'w') as f:
                json.dump({'classes': self.label_encoder.classes_.tolist()}, f)
            
            self.save_crop_details()
            logger.info("Model and artifacts saved successfully")
            
        except Exception as e:
            logger.error(f"Error in model training: {str(e)}")
            raise

    def save_crop_details(self):
        try:
            df = pd.read_csv(self.csv_path)
            if len(df.columns) == 1:
                column_name = df.columns[0]
                df = df[column_name].str.split('\t', expand=True)
                df.columns = [
                    'field_id', 'land', 'temperature', 'humidity', 'rainfall',
                    'budget', 'soil_type', 'ph', 'water_requirement',
                    'suggested_crop', 'suggested_fertilizers', 'suggested_pesticides',
                    'potential_diseases', 'nitrogen', 'phosphorus', 'potassium',
                    'estimated_yield'
                ]
            
            numeric_columns = ['ph', 'nitrogen', 'phosphorus', 'potassium',
                             'water_requirement', 'estimated_yield']
            for col in numeric_columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
            
            crop_details = {}
            for crop_name, group in df.groupby('suggested_crop'):
                crop_details[crop_name.lower().strip()] = {
                    'ph': round(float(group['ph'].mean()), 2),
                    'nitrogen': round(float(group['nitrogen'].mean()), 2),
                    'phosphorus': round(float(group['phosphorus'].mean()), 2),
                    'potassium': round(float(group['potassium'].mean()), 2),
                    'water_requirement': round(float(group['water_requirement'].mean()), 2),
                    'estimated_yield': round(float(group['estimated_yield'].mean()), 2),
                    'fertilizers': group['suggested_fertilizers'].iloc[0],
                    'pesticides': group['suggested_pesticides'].iloc[0],
                    'diseases': group['potential_diseases'].iloc[0]
                }
            
            with open(os.path.join(self.models_dir, 'crop_details.json'), 'w') as f:
                json.dump(crop_details, f, indent=4)
                
        except Exception as e:
            logger.error(f"Error saving crop details: {str(e)}")
            raise

if __name__ == "__main__":
    trainer = CropModelTrainer()
    trainer.train_and_save()
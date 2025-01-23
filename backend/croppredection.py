from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import joblib
import numpy as np
import os
import logging
import pandas as pd
from typing import Dict, Any, Union, Optional
import warnings
import uvicorn
warnings.filterwarnings('ignore', category=DeprecationWarning)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Update CORS configuration
origins = [
    "http://localhost:3000",     # Next.js development server
    "http://127.0.0.1:3000",
    "http://localhost:8000",     # FastAPI development server
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'pkl')
API_KEY = os.getenv('API_KEY', 'your_api_key_here')  # Default value if env var not set

# Load the dataset and create mapping
try:
    # Load the CSV dataset with proper headers
    dataset_path = os.path.join(os.path.dirname(__file__), 'datasets/newdataset.csv')
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset file '{dataset_path}' not found")
    
    crop_data = pd.read_csv(dataset_path)  # Removed names=expected_columns
    logger.info(f"Crop data shape: {crop_data.shape}")
    
    # Ensure 'suggested_crop' is a string and standardize to lowercase
    crop_data['suggested_crop'] = crop_data['suggested_crop'].astype(str).str.lower()
    
    # Preprocess the dataset
    crop_mapping = crop_data.groupby('suggested_crop').agg({
        'suggested_fertilizers': lambda x: x.mode()[0],
        'suggested_pesticides': lambda x: x.mode()[0],
        'potential_diseases': lambda x: x.mode()[0],
        'ph': 'mean',
        'nitrogen': 'mean',
        'phosphorus': 'mean',
        'potassium': 'mean',
        'water_requirement': 'mean',
        'estimated_yield': 'mean'
    }).to_dict(orient='index')
    
    logger.info(f"Barley details: {crop_mapping.get('barley', {})}")
except Exception as e:
    logger.error(f"Error loading or processing dataset: {str(e)}")
    crop_mapping = {}

# Update CropInput model
class CropInput(BaseModel):
    # Required fields
    land: float
    temperature: float
    humidity: float
    rainfall: float
    budget: float
    soil_type: str

    @field_validator('temperature')
    def validate_temperature(cls, v):
        if v < -50 or v > 50:  # Fixed: using > 50 for upper bound
            raise ValueError('Temperature must be between -50 and 50')
        return v

    @field_validator('humidity')
    def validate_humidity(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Humidity must be between 0 and 100')
        return v

    @field_validator('rainfall')
    def validate_rainfall(cls, v):
        if v < 0:
            raise ValueError('Rainfall cannot be negative')
        return v

def validate_api_key(api_key: str = Header(None)) -> bool:
    # In development, accept 'your_api_key_here' or the environment variable if set
    return api_key in [API_KEY, 'your_api_key_here'] or os.getenv('API_KEY') is None

# Load models
try:
    if not os.path.exists(MODELS_DIR):
        raise FileNotFoundError(f"Models directory '{MODELS_DIR}' not found")
    scaler_path = os.path.join(MODELS_DIR, 'crop_recommendation_scaler.pkl')
    model_path = os.path.join(MODELS_DIR, 'crop_recommendation_model.pkl')
    
    if not all(map(os.path.exists, [scaler_path, model_path])):
        raise FileNotFoundError("One or more model files are missing")

    scaler = joblib.load(scaler_path)
    model = joblib.load(model_path)
    logger.info("Models loaded successfully from pkl directory")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise RuntimeError("Failed to load models")

@app.get('/')
async def home():
    return {
        'message': 'Crop Prediction API',
        'endpoints': {
            'predict_crop': {
                'url': '/predict_crop',
                'method': 'POST',
                'required_fields': ['temperature', 'humidity', 'rainfall', 'land', 'budget']
            }
        }
    }

@app.post('/predict_crop')
async def predict_crop(
    crop_input: CropInput,
    request: Request,
    x_api_key: str = Header(None)
):
    logger.info(f"Received prediction request with data: {crop_input.dict()}")
    
    if not validate_api_key(x_api_key):
        logger.error('Unauthorized request')
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        # Set default values for missing features
        input_data = pd.DataFrame([[
            crop_input.temperature,
            crop_input.humidity,
            crop_input.rainfall,
            crop_input.land,
            crop_input.budget,
            0 if crop_input.soil_type == "Clay" else 1,  # soil_type encoding
            80.0,  # default nitrogen
            45.0,  # default phosphorus 
            40.0,  # default potassium
            (80.0 + 45.0 + 40.0) / 3,  # nutrient_balance_ratio
            crop_input.temperature / (crop_input.humidity + 1),  # temp_humidity_stress
            crop_input.rainfall / 100  # water_stress_index
        ]], columns=[
            'temperature', 
            'humidity',
            'rainfall',
            'land',
            'budget',
            'soil_type',
            'nitrogen',
            'phosphorus',
            'potassium',
            'nutrient_balance_ratio',
            'temp_humidity_stress',
            'water_stress_index'
        ])
        
        logger.info(f"Input data: {input_data}")
        
        # Handle missing values if any
        input_data = input_data.fillna(input_data.mean())
        
        scaled_data = scaler.transform(input_data)
        
        logger.info(f"Scaled data: {scaled_data}")
        
        # Make prediction
        predicted_crop = model.predict(scaled_data)[0].strip().lower()
        
        logger.info(f"Predicted crop: {predicted_crop}")
        logger.info(f"Is barley in crop_mapping? {'barley' in crop_mapping}")
        
        confidence_scores = model.predict_proba(scaled_data)
        confidence = float(np.max(confidence_scores))
        
        # Fetch details from crop_mapping
        crop_details = crop_mapping.get(predicted_crop, {})
        
        suggested_fertilizers = crop_details.get('suggested_fertilizers', 'Unknown')
        suggested_pesticides = crop_details.get('suggested_pesticides', 'Unknown')
        potential_diseases = crop_details.get('potential_diseases', 'Unknown')
        pH_value = crop_details.get('ph', 'N/A')
        nitrogen_req = crop_details.get('nitrogen', 'N/A')
        phosphorus_req = crop_details.get('phosphorus', 'N/A')
        potassium_req = crop_details.get('potassium', 'N/A')
        water_requirement = crop_details.get('water_requirement', 'N/A')
        estimated_yield = crop_details.get('estimated_yield', 'N/A')
        
        response = {
            'crop': predicted_crop,
            'confidence': confidence,
            'inputs': crop_input.dict(),
            'suggested_fertilizers': suggested_fertilizers,
            'suggested_pesticides': suggested_pesticides,
            'potential_diseases': potential_diseases,
            'soil_recommendations': {
                'pH Value': pH_value,
                'Nitrogen': f"{nitrogen_req} kg/ha",
                'Phosphorus': f"{phosphorus_req} kg/ha",
                'Potassium': f"{potassium_req} kg/ha",
            },
            'water_requirement_mm': water_requirement,
            'estimated_yield_tons_per_acre': estimated_yield,
            'details': {
                'scaler_used': 'crop_recommendation_scaler',
                'model_used': 'crop_recommendation_model',
            }
        }
        
        return response

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.options("/predict_crop")
async def options_predict():
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept, x-api-key"
    }
    return {"status": "OK"}

if __name__ == "__main__":
    uvicorn.run(
        "croppredection:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

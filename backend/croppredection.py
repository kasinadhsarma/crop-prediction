from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import uvicorn
import joblib
import numpy as np
import os
import logging
import pandas as pd
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = FastAPI()
    
    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )
    
    MODELS_DIR = 'models'
    API_KEY = os.getenv('API_KEY', 'your_api_key_here')
    
    DEFAULT_CROP_DETAILS = {
        'ph': 6.5,
        'nitrogen': 80,
        'phosphorus': 45,
        'potassium': 40,
        'water_requirement': 20,
        'estimated_yield': 5.0,
        'fertilizers': 'NPK balanced fertilizer',
        'pesticides': 'General purpose pesticide',
        'diseases': 'Common crop diseases'
    }

    try:
        with open(os.path.join(MODELS_DIR, 'label_encoder.json'), 'r') as f:
            label_classes = json.load(f)['classes']
        with open(os.path.join(MODELS_DIR, 'crop_details.json'), 'r') as f:
            crop_mapping = json.load(f)
        scaler = joblib.load(os.path.join(MODELS_DIR, 'crop_scaler.pkl'))
        model = joblib.load(os.path.join(MODELS_DIR, 'crop_model.pkl'))
        logger.info("Models and data loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        raise RuntimeError("Failed to load models")

    class CropInput(BaseModel):
        land: float
        temperature: float
        humidity: float
        rainfall: float
        budget: float
        soil_type: str

        @validator('land')
        def validate_land(cls, v):
            if v < 0:
                raise ValueError('Land cannot be negative')
            return v

        @validator('temperature')
        def validate_temperature(cls, v):
            if v < -50 or v > 50:
                raise ValueError('Temperature must be between -50 and 50°C')
            return v

        @validator('humidity')
        def validate_humidity(cls, v):
            if v < 0 or v > 100:
                raise ValueError('Humidity must be between 0 and 100%')
            return v

        @validator('rainfall')
        def validate_rainfall(cls, v):
            if v < 0:
                raise ValueError('Rainfall cannot be negative')
            return v

        @validator('budget')
        def validate_budget(cls, v):
            if v < 0:
                raise ValueError('Budget cannot be negative')
            return v

        @validator('soil_type')
        def validate_soil_type(cls, v):
            valid_types = ["Clay", "Silt", "Sand", "Loam", "Clay_Silt", 
                          "Sandy_Loam", "Silt_Loam", "Clay_Loam", "Loamy_Sand"]
            if v not in valid_types:
                raise ValueError(f'Soil type must be one of: {", ".join(valid_types)}')
            return v

    @app.post('/predict_crop')
    async def predict_crop(
        crop_input: CropInput,
        request: Request,
        x_api_key: str = Header(None)
    ):
        if x_api_key not in [API_KEY, 'your_api_key_here']:
            raise HTTPException(status_code=401, detail="Invalid API key")

        try:
            soil_type_encoded = 1 if crop_input.soil_type in ["Clay", "Clay_Silt", "Clay_Loam"] else 0
            
            input_data = pd.DataFrame([[
                crop_input.temperature,
                crop_input.humidity,
                crop_input.rainfall,
                6.5,
                80.0,
                45.0,
                40.0,
                crop_input.land,
                crop_input.budget,
                soil_type_encoded
            ]], columns=[
                'temperature', 'humidity', 'rainfall', 'ph',
                'nitrogen', 'phosphorus', 'potassium',
                'land', 'budget', 'soil_type_encoded'
            ])

            scaled_data = scaler.transform(input_data)
            predicted_idx = model.predict(scaled_data)[0]
            predicted_crop = label_classes[predicted_idx].lower()
            confidence = float(np.max(model.predict_proba(scaled_data)))

            crop_info = crop_mapping.get(predicted_crop, DEFAULT_CROP_DETAILS)
            ph_value = crop_info.get('ph', 6.5)
            ph_status = "Alkaline" if ph_value > 7 else "Acidic" if ph_value < 7 else "Neutral"
            
            ph_recommendations = {
                "Alkaline": {
                    "impact": "May limit availability of iron, manganese, and phosphorus",
                    "adjustments": "Add sulfur or acidifying fertilizers to lower pH",
                    "management": "Choose alkaline-tolerant crops, monitor micronutrient levels"
                },
                "Acidic": {
                    "impact": "May limit availability of phosphorus, calcium, and magnesium",
                    "adjustments": "Add lime to raise pH",
                    "management": "Choose acid-tolerant crops, add organic matter"
                },
                "Neutral": {
                    "impact": "Optimal for most crops",
                    "adjustments": "Maintain current pH",
                    "management": "Regular soil testing, balanced fertilization"
                }
            }

            return {
                'crop': predicted_crop.capitalize(),
                'confidence': round(confidence, 2),
                'recommendations': {
                    'soil_requirements': {
                        'ph': ph_value,
                        'nitrogen': crop_info['nitrogen'],
                        'phosphorus': crop_info['phosphorus'],
                        'potassium': crop_info['potassium']
                    },
                    'water_requirement': crop_info['water_requirement'],
                    'estimated_yield': crop_info['estimated_yield'],
                    'fertilizers': crop_info['fertilizers'],
                    'pesticides': crop_info['pesticides'],
                    'potential_diseases': crop_info['diseases'],
                    'ph_analysis': {
                        'status': ph_status,
                        'impact': ph_recommendations[ph_status]['impact'],
                        'adjustments': ph_recommendations[ph_status]['adjustments'],
                        'management': ph_recommendations[ph_status]['management']
                    }
                }
            }

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("croppredection:app", host="0.0.0.0", port=8000, reload=True)
from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this import
import joblib
import numpy as np
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Update models directory to pkl
MODELS_DIR = 'pkl'

try:
    # Load the scaler, model, and label encoder from pkl directory
    scaler = joblib.load(os.path.join(MODELS_DIR, 'knn_scaler.pkl'))
    model = joblib.load(os.path.join(MODELS_DIR, 'knn_model.pkl'))
    le = joblib.load(os.path.join(MODELS_DIR, 'label_encoder.pkl'))
    logger.info("Models loaded successfully from pkl directory")
except Exception as e:
    logger.error(f"Error loading models from pkl directory: {str(e)}")
    raise

@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    try:
        # Get input data from JSON request
        data = request.get_json()
        temperature = float(data.get('temperature', 0))
        humidity = float(data.get('humidity', 0))
        ph = float(data.get('ph', 0))  # Changed pH to ph to match dataset
        rainfall = float(data.get('rainfall', 0))
        
        # Create input array
        input_data = np.array([[temperature, humidity, ph, rainfall]])
        
        # Scale the input data
        input_scaled = scaler.transform(input_data)
        
        # Make prediction
        pred_encoded = model.predict(input_scaled)
        predicted_crop = le.inverse_transform(pred_encoded)[0]
        
        # Return prediction as JSON
        return jsonify({'crop': predicted_crop})
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
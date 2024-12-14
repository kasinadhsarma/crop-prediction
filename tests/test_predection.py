import pytest
import json
from unittest.mock import patch
from backend.croppredection import app  # Import the Flask app from the correct location
import numpy as np

@pytest.fixture
def client():
    # Use the test client provided by Flask
    return app.test_client()

def test_predict_crop_success(client):
    with patch('backend.cropprediction.scaler.transform') as mock_scaler, \
         patch('backend.cropprediction.model.predict') as mock_predict, \
         patch('backend.cropprediction.le.inverse_transform') as mock_inverse_transform:

        mock_scaler.return_value = np.array([[0.1, 0.2, 0.3, 0.4]])
        mock_predict.return_value = np.array([0])
        mock_inverse_transform.return_value = np.array(['Rice'])

        input_data = {
            'temperature': 25.0,
            'humidity': 60.0,
            'pH': 6.5,
            'rainfall': 1000.0
        }

        response = client.post('/predict_crop', json=input_data)

        assert response.status_code == 200
        assert response.json == {'crop': 'Rice'}

def test_predict_crop_missing_data(client):
    with patch('backend.cropprediction.scaler.transform'), patch('backend.cropprediction.model.predict'), patch('backend.cropprediction.le.inverse_transform'):
        input_data = {
            'temperature': 25.0,
            'humidity': 60.0,
            # Missing 'pH' and 'rainfall'
        }

        response = client.post('/predict_crop', json=input_data)

        assert response.status_code == 400
        assert 'error' in response.json

def test_predict_crop_invalid_types(client):
    with patch('backend.cropprediction.scaler.transform'), patch('backend.cropprediction.model.predict'), patch('backend.cropprediction.le.inverse_transform'):
        input_data = {
            'temperature': 'twenty five',  # invalid type
            'humidity': 60.0,
            'pH': 6.5,
            'rainfall': 1000.0
        }

        response = client.post('/predict_crop', json=input_data)

        assert response.status_code == 400
        assert 'error' in response.json

def test_predict_crop_model_error(client):
    with patch('backend.cropprediction.scaler.transform'), patch('backend.cropprediction.model.predict') as mock_predict, patch('backend.cropprediction.le.inverse_transform'):
        mock_predict.side_effect = Exception('Model prediction failed')

        input_data = {
            'temperature': 25.0,
            'humidity': 60.0,
            'pH': 6.5,
            'rainfall': 1000.0
        }

        response = client.post('/predict_crop', json=input_data)

        assert response.status_code == 400
        assert 'error' in response.json
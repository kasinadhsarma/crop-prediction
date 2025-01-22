# tests/test_croppredection.py
import pytest
import json
from backend.croppredection import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_endpoint(client):
    """Test the home endpoint returns correct API documentation"""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert 'endpoints' in data
    assert 'predict_crop' in data['endpoints']

def test_predict_missing_data(client):
    """Test prediction with missing data"""
    response = client.post('/predict_crop', json={})
    assert response.status_code == 400
    assert b'Missing required field: area' in response.data

def test_predict_invalid_data(client):
    """Test prediction with invalid data types"""
    invalid_data = {
        'area': 'large',
        'budget': 1000,
        'ph': 6.5,
        'rainfall': 200
    }
    response = client.post('/predict_crop', json=invalid_data)
    assert response.status_code == 400

def test_predict_valid_data(client):
    """Test prediction with valid data"""
    valid_data = {
        'area': 10.0,
        'budget': 1000,
        'ph': 6.5,
        'rainfall': 200
    }
    response = client.post('/predict_crop', json=valid_data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'crop' in data

import requests
import json

url = "http://localhost:8000/predict_crop"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "your_api_key_here"
}
data = {
    "land": 5.0,
    "temperature": 25.0,
    "humidity": 65.0,
    "rainfall": 1200.0,
    "budget": 50000.0,
    "soil_type": "Clay"  # Updated to match valid soil types
}

try:
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except requests.exceptions.RequestException as e:
    print(f"Error: {str(e)}")
except json.JSONDecodeError:
    print("Error: Invalid JSON response")
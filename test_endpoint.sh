#!/bin/bash
curl -X POST "http://127.0.0.1:5000/predict_crop" \
-H "Content-Type: application/json" \
-H "x-api-key: your_api_key_here" \
-d '{
    "land": 5.0,
    "temperature": 25.0,
    "humidity": 65.0,
    "rainfall": 1200.0,
    "budget": 50000.0,
    "soil_type": "Clay"
}'

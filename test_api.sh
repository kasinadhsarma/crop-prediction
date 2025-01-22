#!/bin/bash

# Set error handling
set -e

# Load API key from .env file if it exists
if [ -f .env ]; then
    source .env
fi

# Check if API key is set
if [ -z "$API_KEY" ]; then
    echo "Error: API_KEY is not set"
    exit 1
fi

echo "Testing crop prediction API..."

# Make the API request with verbose output
response=$(curl -s -w "\n%{http_code}" -X POST "http://127.0.0.1:8001/predict_crop" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $API_KEY" \
    -d '{
        "land": 5.0,
        "temperature": 25.0,
        "humidity": 65.0,
        "rainfall": 1200.0,
        "budget": 50000.0,
        "soil_type": "Clay"
    }')

# Get status code from last line
http_code=$(echo "$response" | tail -n1)
# Get response body (remove status code)
body=$(echo "$response" | sed '$d')

# Check HTTP status code
if [ "$http_code" -eq 200 ]; then
    echo "Success! Response:"
    echo "$body" | jq '.' || echo "$body"
else
    echo "Error! Status code: $http_code"
    echo "Response:"
    echo "$body" | jq '.' || echo "$body"
    exit 1
fi
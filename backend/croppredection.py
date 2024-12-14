from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('crop_yield_prediction_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    total_area = data['total_area']
    budget = data['budget']
    soil_type = data['soil_type']
    try:
        crop_type = data['crop_type']
    except KeyError:
        crop_type = None

    input_data = [total_area, budget, soil_type, crop_type]
    prediction = model.predict([input_data])[0]
    return jsonify({'predicted_yield': prediction})

if __name__ == '__main__':
    app.run(debug=True)

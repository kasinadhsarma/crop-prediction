# Python
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
import joblib

# Load your dataset
data = pd.read_csv('datasets/Crop_recommendation.csv')

# Prepare features and target (note the lowercase 'ph')
X = data[['temperature', 'humidity', 'ph', 'rainfall']]
y = data['label']  # Note: target column is named 'label' not 'crop'

# Encode target labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train the model
model = KNeighborsClassifier()
model.fit(X_scaled, y_encoded)

# Save the scaler, model, and label encoder
joblib.dump(scaler, 'knn_scaler.pkl')
joblib.dump(model, 'knn_model.pkl')
joblib.dump(le, 'label_encoder.pkl')
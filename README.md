<<<<<<< HEAD
# Crop Prediction System

An intelligent agricultural decision support system that predicts suitable crops and provides soil management recommendations based on environmental parameters.

## Features

- Crop prediction based on multiple parameters:
  - Soil type and pH levels
  - Temperature and humidity
  - Rainfall patterns
  - Land area and budget
- Detailed soil recommendations
- Real-time environmental data processing
- Agricultural best practices guidance

## Tech Stack

- **Backend:**
  - Python 3.10+
  - FastAPI
  - Scikit-learn
  - Pandas
  - Joblib
  - Uvicorn

- **Frontend:**
  - Next.js 13+
  - TypeScript
  - Tailwind CSS
  - React Components

- **ML Models:**
  - Trained using scikit-learn
  - Stored as PKL files
  - Features environmental parameters

## Installation

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Clone repository
cd crop-prediction

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python3 backend/croppredection.py
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following content:

```plaintext
API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## Usage

1. Access the web interface at `http://localhost:3000`
2. Input environmental parameters:
   - Land area
   - Temperature
   - Humidity
   - Rainfall
   - Soil type
   - Budget
3. Get predictions and recommendations

## API Endpoints

- `POST /predict_crop`: Predict suitable crops
- `GET /`: API health check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Acknowledgments

- Agricultural datasets
- ML model contributors
=======
# crop-prediction
>>>>>>> 422efc380502147a34e1fa1766bff856f78ba98f

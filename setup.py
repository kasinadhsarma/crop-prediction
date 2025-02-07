from setuptools import setup, find_packages

setup(
    name="crop-prediction",
    version="0.1.0",
    packages=find_packages(include=['backend', 'backend.*']),
    package_data={
        'backend': ['*.py', '*.json', '*.pkl'],
    },
    install_requires=[
        "fastapi",
        "uvicorn",
        "numpy",
        "pandas",
        "scikit-learn",
        "joblib",
        "pydantic"
    ],
)

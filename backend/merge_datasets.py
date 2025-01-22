import pandas as pd
import os

# Read datasets
crop_recommendation_df = pd.read_csv('datasets/Crop_recommendation.csv')
crop_yield_df = pd.read_csv('datasets/crop_yield.csv')

# Merge datasets on common columns
merged_df = pd.merge(crop_recommendation_df, crop_yield_df, on=['common_column1', 'common_column2'])

# Save merged dataset
merged_df.to_csv('datasets/merged_dataset.csv', index=False)

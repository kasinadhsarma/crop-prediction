import pandas as pd

# Enhanced Agricultural Dataset
enhanced_data = {
    # Basic Environmental Conditions
    'Temperature_Mean_Celsius': [],
    'Humidity_Percentage': [],
    'pH_Value': [],
    'Annual_Rainfall_mm': [],
    
    # Soil Characteristics
    'Soil_Type': [],
    'Soil_Organic_Matter_Percentage': [],
    'Nitrogen_Level_kg_ha': [],
    'Phosphorus_Level_kg_ha': [],
    'Potassium_Level_kg_ha': [],
    'Soil_Moisture_Retention': [],
    
    # Crop Recommendations
    'Recommended_Crops': [],
    'Alternative_Crops': [],
    'Optimal_Planting_Season': [],
    
    # Water Requirements
    'Water_Requirement_mm_season': [],
    'Irrigation_Recommendation': [],
    
    # Fertilizer Recommendations
    'Recommended_Fertilizer_NPK_Ratio': [],
    'Fertilizer_Application_Rate_kg_ha': [],
    
    # Pest and Disease Management
    'Potential_Pests': [],
    'Potential_Diseases': [],
    'Pesticide_Recommendation': [],
    
    # Yield Prediction
    'Estimated_Yield_Tonnes_ha': [],
    'Yield_Potential_Category': [],
    
    # Economic Indicators
    'Input_Cost_USD_ha': [],
    'Potential_Profit_Margin_Percentage': []
}

# Sample data transformation
original_data = pd.read_csv('datasets/Crop_recommendation.csv')

def recommend_crops(temp, humidity, rainfall, soil_type):
    """Crop recommendation logic based on environmental conditions"""
    if temp < 15 and humidity < 60 and rainfall < 600:
        return ['Barley', 'Wheat', 'Oats'], ['Rye', 'Triticale']
    elif temp > 25 and humidity > 70 and rainfall > 1000:
        return ['Rice', 'Sugarcane', 'Jute'], ['Corn', 'Sorghum']
    elif temp > 20 and 50 <= humidity <= 70 and 600 <= rainfall <= 900:
        return ['Maize', 'Sorghum', 'Millet'], ['Sunflower', 'Cotton']
    else:
        return ['Mixed Crops'], ['Adaptable Varieties']

def recommend_fertilizers(soil_type, crop_type):
    """Fertilizer recommendation based on soil and crop"""
    fertilizer_mapping = {
        'Loam': {'Wheat': '10-20-10', 'Corn': '15-15-15'},
        'Clay': {'Rice': '14-14-14', 'Sugarcane': '20-10-10'},
        'Sandy': {'Millet': '12-12-12', 'Sunflower': '10-20-10'}
    }
    return fertilizer_mapping.get(soil_type, {}).get(crop_type, '12-12-12')

def estimate_yield(temp, rainfall, soil_type):
    """Yield estimation based on environmental factors"""
    base_yield = 3.0  # tonnes per hectare
    temp_factor = 1 + (temp - 20) * 0.05
    rainfall_factor = 1 + (rainfall - 750) / 1000
    soil_factors = {'Loam': 1.2, 'Clay': 1.0, 'Sandy': 0.8}
    
    estimated_yield = base_yield * temp_factor * rainfall_factor * soil_factors.get(soil_type, 1.0)
    return max(1.0, min(estimated_yield, 8.0))  # Constrain yield between 1-8 tonnes/ha

# Transform data
for index, row in original_data.iterrows():
    temp = row['Temperature_Mean_Celsius']
    humidity = row['Humidity_Percentage']
    rainfall = row['Annual_Rainfall_mm']
    soil_type = row['Soil_Type']
    
    main_crops, alt_crops = recommend_crops(temp, humidity, rainfall, soil_type)
    
    enhanced_data['Temperature_Mean_Celsius'].append(temp)
    enhanced_data['Humidity_Percentage'].append(humidity)
    enhanced_data['pH_Value'].append(row['pH_Value'])
    enhanced_data['Annual_Rainfall_mm'].append(rainfall)
    
    enhanced_data['Soil_Type'].append(soil_type)
    enhanced_data['Soil_Organic_Matter_Percentage'].append(row['Soil_Organic_Matter_Percentage'])
    
    # Estimate nutrient levels based on soil type and organic matter
    om_multiplier = row['Soil_Organic_Matter_Percentage']
    enhanced_data['Nitrogen_Level_kg_ha'].append(round(100 * om_multiplier, 2))
    enhanced_data['Phosphorus_Level_kg_ha'].append(round(80 * om_multiplier, 2))
    enhanced_data['Potassium_Level_kg_ha'].append(round(60 * om_multiplier, 2))
    
    enhanced_data['Soil_Moisture_Retention'].append(row['Soil_Moisture_Retention'])
    
    enhanced_data['Recommended_Crops'].append(', '.join(main_crops))
    enhanced_data['Alternative_Crops'].append(', '.join(alt_crops))
    enhanced_data['Optimal_Planting_Season'].append('Depends on Local Climate')
    
    # Water requirements (estimated)
    water_req = rainfall * 1.2  # Considering additional irrigation needs
    enhanced_data['Water_Requirement_mm_season'].append(round(water_req, 2))
    enhanced_data['Irrigation_Recommendation'].append('Recommended' if row['Irrigation_Availability'] == 'Yes' else 'Limited')
    
    # Fertilizer recommendations
    main_crop = main_crops[0]
    fertilizer = recommend_fertilizers(soil_type, main_crop)
    enhanced_data['Recommended_Fertilizer_NPK_Ratio'].append(fertilizer)
    enhanced_data['Fertilizer_Application_Rate_kg_ha'].append(row['Fertilizer_Use_kg_ha'])
    
    # Pest and Disease Management
    enhanced_data['Potential_Pests'].append('Common Regional Pests')
    enhanced_data['Potential_Diseases'].append('Localized Plant Diseases')
    enhanced_data['Pesticide_Recommendation'].append(f"{row['Pesticide_Use_kg_ha']} kg/ha recommended")
    # Yield Prediction
    estimated_yield = estimate_yield(temp, rainfall, soil_type)
    enhanced_data['Estimated_Yield_Tonnes_ha'].append(round(estimated_yield, 2))
    enhanced_data['Yield_Potential_Category'].append('Good' if estimated_yield > 4 else 'Moderate')
    
    # Economic Indicators
    enhanced_data['Input_Cost_USD_ha'].append(row['Input_Cost_USD_ha'])
    enhanced_data['Potential_Profit_Margin_Percentage'].append(row['Profit_Margin_Percentage'])

# Convert to DataFrame
enhanced_df = pd.DataFrame(enhanced_data)

# Save to CSV
enhanced_df.to_csv('enhanced_agricultural_dataset.csv', index=False)

print(enhanced_df.head())
print(enhanced_df.head())
print("\nColumns:", list(enhanced_df.columns))
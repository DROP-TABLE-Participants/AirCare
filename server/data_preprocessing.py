"""
Data Preprocessing Module for Aircraft Predictive Maintenance System

This module handles data loading, cleaning, and feature engineering for both
training and inference. It processes both NASA C-MAPSS and NGAFID datasets.
"""

import pandas as pd
import numpy as np
# Use our custom implementations instead of scikit-learn
from custom_utils import StandardScaler, LabelEncoder
import pyarrow.parquet as pq
import os
from pathlib import Path

def load_cmapss_data(dataset_path=None):
    """Load and preprocess NASA C-MAPSS dataset."""
    if dataset_path is None:
        # Default path as a fallback
        current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
        dataset_path = str(current_dir / 'data' / 'model' / 'datasets' / 'CMaps') + '/'
    
    print(f"Loading CMAPSS data from: {dataset_path}")
    train_files = [f'train_FD00{i}.txt' for i in range(1, 5)]
    test_files = [f'test_FD00{i}.txt' for i in range(1, 5)]
    rul_files = [f'RUL_FD00{i}.txt' for i in range(1, 5)]
    
    column_names = ['unit', 'cycle', 'op_setting_1', 'op_setting_2', 'op_setting_3'] + \
                  [f'sensor_{i}' for i in range(1, 22)]
    
    dfs = []
    for train_file in train_files:
        file_path = os.path.join(dataset_path, train_file)
        if not os.path.exists(file_path):
            print(f"Warning: File {file_path} not found. Skipping.")
            continue
            
        try:
            df = pd.read_csv(file_path, delimiter=' ', header=None, names=column_names)
            df = df.drop(columns=df.columns[df.isna().all()].tolist())  # Remove NaN columns
            dfs.append(df)
        except Exception as e:
            print(f"Error reading {file_path}: {str(e)}")
            continue
    
    if not dfs:
        # Create a minimal dummy dataframe if no files were found
        print("Warning: No valid files found. Creating dummy dataset for demonstration.")
        dummy_data = {
            'unit': [1, 1, 2, 2],
            'cycle': [1, 2, 1, 2],
            'op_setting_1': [0.5, 0.5, 0.6, 0.6],
            'op_setting_2': [0.7, 0.7, 0.8, 0.8],
            'op_setting_3': [0.9, 0.9, 0.9, 0.9]
        }
        # Add sensor readings
        for i in range(1, 22):
            dummy_data[f'sensor_{i}'] = [0.1*i, 0.2*i, 0.1*i, 0.2*i]
        return pd.DataFrame(dummy_data)
    
    return pd.concat(dfs, ignore_index=True)

def load_ngafid_data(dataset_path=None):
    """Load and preprocess NGAFID maintenance dataset."""
    if dataset_path is None:
        # Default path as a fallback
        current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
        dataset_path = str(current_dir / 'data' / 'model' / 'datasets' / 'Aviation Maintanance Dataset') + '/'
    
    print(f"Loading NGAFID data from: {dataset_path}")
    
    try:
        # Try to load the flight header
        flight_header_path = os.path.join(dataset_path, 'all_flights/all_flights/flight_header.csv')
        if not os.path.exists(flight_header_path):
            print(f"Warning: File {flight_header_path} not found.")
            flight_header = None
        else:
            flight_header = pd.read_csv(flight_header_path)
            print(f"Successfully loaded flight_header.csv with {len(flight_header)} rows and columns: {flight_header.columns.tolist()}")
            # Return flight_header directly since it already has all the data we need
            return flight_header
            
        # Try to load the flight data (will be used only if flight_header is not found)
        parquet_dir_path = os.path.join(dataset_path, 'all_flights/all_flights/one_parq/')
        if not os.path.exists(parquet_dir_path):
            print(f"Warning: Directory {parquet_dir_path} not found.")
            flight_data = None
        else:
            try:
                flight_data = pq.read_table(parquet_dir_path).to_pandas()
                print(f"Successfully loaded parquet data with {len(flight_data)} rows")
            except Exception as e:
                print(f"Error loading parquet data: {str(e)}")
                flight_data = None
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        flight_header = None
        flight_data = None
        
    if flight_header is None and flight_data is None:
        # Create a minimal dummy dataframe if data couldn't be loaded
        print("Warning: Data could not be loaded. Creating dummy dataset for demonstration.")
        # Create dummy data that matches the format of flight_header.csv
        dummy_data = {
            'Master Index': range(1, 101),
            'before_after': np.random.choice(['before', 'same', 'after'], size=100),
            'date_diff': np.random.randint(-5, 6, size=100),
            'flight_length': np.random.uniform(10, 10000, size=100),
            'label': ['intake gasket leak/damage'] * 100,
            'hierarchy': [''] * 100,
            'number_flights_before': np.random.randint(-1, 5, size=100)
        }
        return pd.DataFrame(dummy_data)
    
    # If we have flight_data but no flight_header, return flight_data 
    if flight_header is None and flight_data is not None:
        return flight_data
        
    # Default case - we shouldn't reach here
    print("Warning: Using fallback dummy data")
    dummy_data = {
        'Master Index': range(1, 101),
        'before_after': np.random.choice(['before', 'same', 'after'], size=100),
        'date_diff': np.random.randint(-5, 6, size=100),
        'flight_length': np.random.uniform(10, 10000, size=100),
        'label': ['intake gasket leak/damage'] * 100,
        'hierarchy': [''] * 100,
        'number_flights_before': np.random.randint(-1, 5, size=100)
    }
    return pd.DataFrame(dummy_data)

def prepare_failure_features(input_json, weather_data=None):
    """Prepare features for part failure prediction model."""
    features = {
        'aircraft_model': input_json['aircraft_model'],
        'flight_cycles': input_json['flight_cycles']
    }
    
    # Add weather features if available
    if weather_data:
        # Update to handle flattened weather data structure
        features.update({
            'temperature': weather_data.get('temperature', 15.0),
            'humidity': weather_data.get('humidity', 50),
            'wind_speed': weather_data.get('wind_speed', 0.0),
            'wind_direction': weather_data.get('wind_direction', 0)
        })
    
    # Add sensor readings if available
    if 'recent_sensor_data' in input_json:
        features.update(input_json['recent_sensor_data'])
    
    return features

def prepare_rul_features(input_json):
    """Prepare features for RUL prediction model."""
    features = {
        'aircraft_model': input_json['aircraft_model'],
        'flight_hours': input_json['flight_hours']
    }
    
    # Add sensor readings
    if 'sensor_readings' in input_json:
        features.update(input_json['sensor_readings'])
    
    return pd.DataFrame([features])

def prepare_fuel_features(input_json, weather_data=None):
    """Prepare features for fuel consumption prediction model."""
    features = {
        'aircraft_model': input_json['aircraft_model'],
        'route_distance': calculate_distance(input_json['origin'], input_json['destination'])
    }
    
    # Add payload if available
    if 'payload_weight' in input_json:
        features['payload_weight'] = input_json['payload_weight']
    
    # Add weather features if available
    if weather_data:
        # Update to handle flattened weather data structure
        features.update({
            'temperature': weather_data.get('temperature', 15.0),
            'wind_speed': weather_data.get('wind_speed', 0.0),
            'wind_direction': weather_data.get('wind_direction', 0)
        })
    
    return pd.DataFrame([features])

def calculate_distance(origin, destination):
    """Calculate great circle distance between two airports."""
    # This is a placeholder - in practice, we would use a proper airport database
    # and haversine formula or similar to calculate actual distances
    return 1000  # Default distance in km for now

class FeatureProcessor:
    """Class to handle feature scaling and encoding consistently."""
    def __init__(self):
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.categorical_columns = ['aircraft_model']
        self.numerical_columns = None  # Will be set during fit
        
    def fit(self, df):
        """Fit the preprocessor on training data."""
        # Initialize label encoders for categorical columns
        for col in self.categorical_columns:
            if col in df.columns:
                self.label_encoders[col] = LabelEncoder()
                df[col] = self.label_encoders[col].fit_transform(df[col])
        
        # Identify numerical columns
        self.numerical_columns = df.select_dtypes(include=[np.number]).columns
        
        # Fit scaler on numerical columns
        self.scaler.fit(df[self.numerical_columns])
        
        return self
    
    def transform(self, df):
        """Transform new data using fitted preprocessor."""
        df = df.copy()
        
        # Transform categorical columns
        for col in self.categorical_columns:
            if col in df.columns:
                # Handle unseen categories
                df[col] = df[col].map(lambda x: x if x in self.label_encoders[col].classes_ else 'unknown')
                df[col] = self.label_encoders[col].transform(df[col])
        
        # Scale numerical columns
        if self.numerical_columns is not None:
            df[self.numerical_columns] = self.scaler.transform(df[self.numerical_columns])
        
        return df
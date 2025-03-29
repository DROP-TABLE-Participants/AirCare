"""
Flask API for Aircraft Predictive Maintenance System

This module provides three endpoints:
1. /predict-failure - Predict probability of part failure
2. /predict-rul - Predict Remaining Useful Life
3. /predict-fuel - Predict fuel consumption and anomalies
"""

from flask import Flask, request, jsonify
from predictor import predictor
from weather_api import get_weather
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("app.log"),
                        logging.StreamHandler()
                    ])
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "healthy"}), 200

@app.route('/api/v1/predict/failure', methods=['POST'])
def predict_failure():
    """Endpoint to predict probability of part failure."""
    try:
        logger.info("Received request to /api/v1/predict/failure")
        
        # Get input data
        data = request.json
        logger.info(f"Request data: {data}")
        
        # Validate required fields
        required_fields = ['aircraft_model', 'flight_cycles', 'airport_code']
        for field in required_fields:
            if field not in data:
                logger.error(f"Missing required field: {field}")
                return jsonify({
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Get weather data if airport code is provided
        weather_data = None
        if data.get('airport_code'):
            logger.info(f"Getting weather data for airport: {data['airport_code']}")
            try:
                # Get flat dictionary of weather features
                weather_data = get_weather(data['airport_code'])
                logger.info(f"Weather data received: {weather_data}")
            except Exception as e:
                logger.warning(f"Error fetching weather data: {str(e)}. Continuing without weather data.")
            
        # Make prediction
        logger.info("Calling predictor.predict_failure...")
        try:
            prediction = predictor.predict_failure(data, weather_data)
            logger.info(f"Prediction successful: {prediction}")
            return jsonify(prediction), 200
        except Exception as e:
            logger.error(f"Error in predictor.predict_failure: {str(e)}", exc_info=True)
            raise
        
    except Exception as e:
        logger.error(f"Error in predict_failure endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": str(e),
            "type": str(type(e).__name__)
        }), 500

@app.route('/api/v1/predict/rul', methods=['POST'])
def predict_rul():
    """Endpoint to predict Remaining Useful Life."""
    try:
        # Get input data
        data = request.json
        
        # Validate required fields
        required_fields = ['aircraft_model', 'flight_hours']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Make prediction
        prediction = predictor.predict_rul(data)
        return jsonify(prediction), 200
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "type": str(type(e).__name__)
        }), 500

@app.route('/api/v1/predict/fuel', methods=['POST'])
def predict_fuel():
    """Endpoint to predict fuel consumption."""
    try:
        # Get input data
        data = request.json
        
        # Validate required fields
        required_fields = ['aircraft_model', 'origin', 'destination']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Get weather data for both origin and destination
        origin_weather = get_weather(data['origin'])
        dest_weather = get_weather(data['destination'])
        
        # Average the weather conditions (simple approach)
        if origin_weather and dest_weather:
            # Create a combined weather data dictionary with averaged values
            weather_data = {}
            
            # Combine numerical values (average them)
            for key in ['temperature', 'humidity', 'pressure', 'wind_speed', 'wind_direction']:
                if key in origin_weather and key in dest_weather:
                    weather_data[key] = (origin_weather[key] + dest_weather[key]) / 2
            
            # For categorical features, take the origin values
            for key in ['weather_code', 'weather_main', 'weather_description', 
                       'is_clear', 'is_cloudy', 'is_rainy', 'is_snowy', 'is_stormy']:
                if key in origin_weather:
                    weather_data[key] = origin_weather[key]
        else:
            weather_data = None
        
        # Make prediction
        prediction = predictor.predict_fuel(data, weather_data)
        return jsonify(prediction), 200
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "type": str(type(e).__name__)
        }), 500

if __name__ == '__main__':
    # Use port 5200 as default to avoid conflicts with AirPlay on macOS (port 5000)
    port = int(os.environ.get('PORT', 5200))
    
    print(f"Starting server on port {port}...")
    
    # Run the application
    app.run(
        host='0.0.0.0',  # Make server publicly available
        port=port,
        debug=os.environ.get('FLASK_ENV') == 'development'  # Enable debug mode in development
    )
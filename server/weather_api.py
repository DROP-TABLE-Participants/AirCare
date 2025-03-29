"""
Weather API Module for Aircraft Predictive Maintenance System

This module interacts with OpenWeatherMap API to fetch weather data
for flight origins and destinations to enhance prediction accuracy.
"""

import os
import requests
import datetime
import json
from typing import Dict, Any, Optional, Tuple
import logging
import traceback

# Configure logging - increase level to DEBUG for more detailed logs
logging.basicConfig(level=logging.DEBUG, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load API key from environment variable
API_KEY = os.environ.get('OPENWEATHER_API_KEY', '0708a304fb43269df9d27f82c7a612d5')
BASE_URL = "https://api.openweathermap.org/data/2.5"

# Simple in-memory cache to reduce API calls
_weather_cache = {}
CACHE_EXPIRY = 3600  # Cache expiry in seconds (1 hour)

# Airport coordinates dictionary for common airports
# Format: IATA code: (latitude, longitude)
AIRPORT_COORDS = {
    "JFK": (40.6413, -73.7781),  # New York JFK
    "LAX": (33.9416, -118.4085),  # Los Angeles
    "ORD": (41.9742, -87.9073),   # Chicago O'Hare
    "ATL": (33.6407, -84.4277),   # Atlanta
    "DFW": (32.8998, -97.0403),   # Dallas/Fort Worth
    "SFO": (37.7749, -122.4194),  # San Francisco
    "LHR": (51.4700, -0.4543),    # London Heathrow
    "CDG": (49.0097, 2.5479),     # Paris Charles de Gaulle
    # Add more airports as needed
}

def get_airport_coordinates(airport_code: str) -> Tuple[float, float]:
    """
    Get coordinates for a given airport code.
    
    Args:
        airport_code (str): IATA airport code (e.g., "JFK")
        
    Returns:
        tuple: (latitude, longitude)
        
    Raises:
        ValueError: If airport code is not found in the dictionary
    """
    logger.debug(f"Looking up coordinates for airport code: {airport_code}")
    airport_code = airport_code.upper()
    if airport_code in AIRPORT_COORDS:
        coords = AIRPORT_COORDS[airport_code]
        logger.debug(f"Found coordinates for {airport_code}: {coords}")
        return coords
    else:
        logger.warning(f"Airport code {airport_code} not found in database")
        # In a production environment, this could call a geocoding API
        # to get coordinates for any airport
        raise ValueError(f"Airport code {airport_code} not found in database")

def get_cache_key(location: str, timestamp: datetime.datetime) -> str:
    """
    Generate a cache key for weather data.
    
    Args:
        location (str): Location identifier (airport code or city name)
        timestamp (datetime.datetime): Time for which weather is needed
        
    Returns:
        str: Cache key
    """
    # Round timestamp to nearest hour to improve cache hits
    rounded_hour = timestamp.replace(minute=0, second=0, microsecond=0)
    key = f"{location}_{rounded_hour.isoformat()}"
    logger.debug(f"Generated cache key: {key}")
    return key

def get_weather(location: str, timestamp: Optional[datetime.datetime] = None) -> Dict[str, Any]:
    """
    Get weather data for a location and time.
    
    Args:
        location (str): Airport code or city name
        timestamp (datetime.datetime, optional): Time for which weather is needed.
            If None, current weather is fetched.
            
    Returns:
        dict: Weather data with extracted relevant features
    """
    try:
        logger.info(f"Fetching weather for location: {location}, time: {timestamp}")
        
        if timestamp is None:
            timestamp = datetime.datetime.now()
            logger.debug(f"No timestamp provided, using current time: {timestamp}")
        
        # Check cache first
        cache_key = get_cache_key(location, timestamp)
        current_time = datetime.datetime.now()
        
        if cache_key in _weather_cache:
            cached_result, cache_time = _weather_cache[cache_key]
            # Check if cache is still valid (not expired)
            if (current_time - cache_time).total_seconds() < CACHE_EXPIRY:
                logger.debug(f"Using cached weather data for {cache_key}")
                return cached_result
            else:
                logger.debug(f"Cache expired for {cache_key}")
        else:
            logger.debug(f"No cache entry found for {cache_key}")
        
        # Determine if we need current weather or forecast
        now = datetime.datetime.now()
        time_diff = (timestamp - now).total_seconds()
        
        logger.debug(f"Time difference from now: {time_diff} seconds")
        
        try:
            # Get coordinates for the location
            location_type = "unknown"
            if location.upper() in AIRPORT_COORDS:
                logger.debug(f"Looking up coordinates for airport: {location}")
                lat, lon = get_airport_coordinates(location)
                location_type = "airport"
                logger.debug(f"Coordinates for {location}: lat={lat}, lon={lon}")
            else:
                # Assume location is a city name
                logger.debug(f"Treating {location} as a city name")
                lat, lon = None, None
                city_name = location
                location_type = "city"
        
            logger.info(f"Determined location type: {location_type}")
            
            if time_diff < 3600 and time_diff > -3600:  # Within 1 hour of current time
                # Get current weather
                endpoint = f"{BASE_URL}/weather"
                logger.debug(f"Using current weather endpoint: {endpoint}")
                
                if lat is not None and lon is not None:
                    params = {"lat": lat, "lon": lon, "appid": API_KEY, "units": "metric"}
                    logger.debug(f"Request params using coordinates: lat={lat}, lon={lon}")
                else:
                    params = {"q": city_name, "appid": API_KEY, "units": "metric"}
                    logger.debug(f"Request params using city name: q={city_name}")
                    
                logger.debug(f"Making API request to: {endpoint}")
                response = requests.get(endpoint, params=params)
                logger.debug(f"API response status code: {response.status_code}")
                
                if response.status_code != 200:
                    logger.error(f"API error: {response.status_code} - {response.text}")
                    return get_default_weather()
                
                raw_data = response.json()
                logger.debug(f"Received raw weather data: {json.dumps(raw_data, indent=2)}")
                
                # Process current weather data
                logger.debug("Extracting features from current weather data")
                weather_data = extract_weather_features(raw_data, "current")
                
            else:
                # Get forecast
                endpoint = f"{BASE_URL}/forecast"
                logger.debug(f"Using forecast endpoint: {endpoint}")
                
                if lat is not None and lon is not None:
                    params = {"lat": lat, "lon": lon, "appid": API_KEY, "units": "metric"}
                    logger.debug(f"Request params using coordinates: lat={lat}, lon={lon}")
                else:
                    params = {"q": city_name, "appid": API_KEY, "units": "metric"}
                    logger.debug(f"Request params using city name: q={city_name}")
                    
                logger.debug(f"Making API request to: {endpoint}")
                response = requests.get(endpoint, params=params)
                logger.debug(f"API response status code: {response.status_code}")
                
                if response.status_code != 200:
                    logger.error(f"API error: {response.status_code} - {response.text}")
                    return get_default_weather()
                    
                raw_data = response.json()
                logger.debug(f"Received forecast data with {len(raw_data.get('list', []))} entries")
                
                # Find closest forecast time to requested timestamp
                logger.debug(f"Finding closest forecast to time: {timestamp}")
                closest_forecast = find_closest_forecast(raw_data, timestamp)
                
                # Process forecast data
                logger.debug("Extracting features from forecast data")
                weather_data = extract_weather_features(closest_forecast, "forecast")
            
            # Cache the result
            logger.debug(f"Caching weather data with key: {cache_key}")
            _weather_cache[cache_key] = (weather_data, current_time)
            
            logger.info(f"Successfully retrieved weather data for {location}")
            return weather_data
            
        except Exception as e:
            logger.error(f"Error in weather data retrieval: {str(e)}")
            logger.error(f"Stack trace: {traceback.format_exc()}")
            # Return default weather data in case of error
            return get_default_weather()
    
    except Exception as outer_e:
        logger.error(f"Outer exception in get_weather: {str(outer_e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return get_default_weather()

def find_closest_forecast(forecast_data: Dict[str, Any], target_time: datetime.datetime) -> Dict[str, Any]:
    """
    Find the forecast entry closest to the target time.
    
    Args:
        forecast_data (dict): OpenWeatherMap forecast response
        target_time (datetime.datetime): Target time to find forecast for
        
    Returns:
        dict: The forecast entry closest to target time
    """
    logger.debug(f"Finding closest forecast to target time: {target_time}")
    closest_forecast = None
    min_diff = float('inf')
    
    forecast_list = forecast_data.get('list', [])
    logger.debug(f"Received {len(forecast_list)} forecast entries")
    
    if not forecast_list:
        logger.warning("Empty forecast list received")
        raise ValueError("No forecast data found")
    
    for forecast in forecast_list:
        forecast_time = datetime.datetime.fromtimestamp(forecast['dt'])
        time_diff = abs((forecast_time - target_time).total_seconds())
        
        logger.debug(f"Forecast entry time: {forecast_time}, difference: {time_diff} seconds")
        
        if time_diff < min_diff:
            min_diff = time_diff
            closest_forecast = forecast
            logger.debug(f"New closest forecast found at {forecast_time}, diff: {min_diff}")
    
    if closest_forecast is None:
        logger.warning("No closest forecast found")
        raise ValueError("No forecast data found")
        
    logger.debug(f"Found closest forecast at time diff: {min_diff} seconds")
    return closest_forecast

def extract_weather_features(weather_data: Dict[str, Any], data_type: str) -> Dict[str, Any]:
    """
    Extract relevant weather features from API response.
    
    Args:
        weather_data (dict): Weather API response data
        data_type (str): Type of data ('current' or 'forecast')
        
    Returns:
        dict: Extracted weather features
    """
    logger.debug(f"Extracting weather features from {data_type} data")
    features = {}
    
    try:
        # Log the structure of the incoming data
        logger.debug(f"Weather data keys: {list(weather_data.keys())}")
        if 'main' in weather_data:
            logger.debug(f"Main data keys: {list(weather_data['main'].keys())}")
        if 'wind' in weather_data:
            logger.debug(f"Wind data keys: {list(weather_data['wind'].keys())}")
        if 'weather' in weather_data:
            logger.debug(f"Weather array length: {len(weather_data['weather'])}")
            if weather_data['weather']:
                logger.debug(f"First weather item keys: {list(weather_data['weather'][0].keys())}")
        
        if data_type == "current":
            # Temperature in Celsius
            features['temperature'] = weather_data.get('main', {}).get('temp')
            logger.debug(f"Extracted temperature: {features['temperature']}")
            
            # Humidity in percentage
            features['humidity'] = weather_data.get('main', {}).get('humidity')
            logger.debug(f"Extracted humidity: {features['humidity']}")
            
            # Pressure in hPa
            features['pressure'] = weather_data.get('main', {}).get('pressure')
            logger.debug(f"Extracted pressure: {features['pressure']}")
            
            # Wind speed in m/s
            features['wind_speed'] = weather_data.get('wind', {}).get('speed')
            logger.debug(f"Extracted wind_speed: {features['wind_speed']}")
            
            # Wind direction in degrees
            features['wind_direction'] = weather_data.get('wind', {}).get('deg')
            logger.debug(f"Extracted wind_direction: {features['wind_direction']}")
            
            # Weather condition code
            weather_info = weather_data.get('weather', [{}])[0]
            features['weather_code'] = weather_info.get('id')
            logger.debug(f"Extracted weather_code: {features['weather_code']}")
            
            features['weather_main'] = weather_info.get('main')
            logger.debug(f"Extracted weather_main: {features['weather_main']}")
            
            features['weather_description'] = weather_info.get('description')
            logger.debug(f"Extracted weather_description: {features['weather_description']}")
            
        elif data_type == "forecast":
            # For forecast data, the structure might be slightly different
            features['temperature'] = weather_data.get('main', {}).get('temp')
            logger.debug(f"Extracted temperature: {features['temperature']}")
            
            features['humidity'] = weather_data.get('main', {}).get('humidity')
            logger.debug(f"Extracted humidity: {features['humidity']}")
            
            features['pressure'] = weather_data.get('main', {}).get('pressure')
            logger.debug(f"Extracted pressure: {features['pressure']}")
            
            features['wind_speed'] = weather_data.get('wind', {}).get('speed')
            logger.debug(f"Extracted wind_speed: {features['wind_speed']}")
            
            features['wind_direction'] = weather_data.get('wind', {}).get('deg')
            logger.debug(f"Extracted wind_direction: {features['wind_direction']}")
            
            weather_info = weather_data.get('weather', [{}])[0]
            features['weather_code'] = weather_info.get('id')
            logger.debug(f"Extracted weather_code: {features['weather_code']}")
            
            features['weather_main'] = weather_info.get('main')
            logger.debug(f"Extracted weather_main: {features['weather_main']}")
            
            features['weather_description'] = weather_info.get('description')
            logger.debug(f"Extracted weather_description: {features['weather_description']}")
            
        # Convert weather conditions to categorical features
        # Weather codes: https://openweathermap.org/weather-conditions
        weather_code = features.get('weather_code', 0)
        logger.debug(f"Processing weather_code for categorical features: {weather_code}")
        
        # Ensure weather_code is not None before making comparisons
        if weather_code is not None:
            logger.debug(f"Weather code is not None, determining weather categories")
            features['is_clear'] = 1 if 800 <= weather_code <= 801 else 0
            features['is_cloudy'] = 1 if 802 <= weather_code <= 804 else 0
            features['is_rainy'] = 1 if 500 <= weather_code <= 531 else 0
            features['is_snowy'] = 1 if 600 <= weather_code <= 622 else 0
            features['is_stormy'] = 1 if 200 <= weather_code <= 232 else 0
        else:
            logger.warning("Weather code is None, using default weather categories")
            # Default values when weather_code is None
            features['is_clear'] = 0
            features['is_cloudy'] = 0
            features['is_rainy'] = 0
            features['is_snowy'] = 0
            features['is_stormy'] = 0
            # Make sure weather_code is set to a default value rather than None
            features['weather_code'] = 0
        
        logger.debug(f"Final weather categories: clear={features['is_clear']}, cloudy={features['is_cloudy']}, "
                    f"rainy={features['is_rainy']}, snowy={features['is_snowy']}, stormy={features['is_stormy']}")
        
    except Exception as e:
        logger.error(f"Error extracting weather features: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        # Log the weather_data that caused the error
        logger.error(f"Weather data that caused error: {weather_data}")
    
    # Do a final check for wind speed and direction - if they're None, set to safe defaults
    if features.get('wind_speed') is None:
        logger.warning("Wind speed is None, setting to 0")
        features['wind_speed'] = 0.0
    
    if features.get('wind_direction') is None:
        logger.warning("Wind direction is None, setting to 0")
        features['wind_direction'] = 0
        
    return features

def calculate_headwind(wind_speed: float, wind_direction: float, 
                      flight_direction: float) -> float:
    """
    Calculate headwind component based on wind speed, wind direction,
    and flight direction.
    
    Args:
        wind_speed (float): Wind speed in m/s
        wind_direction (float): Wind direction in degrees (meteorological)
        flight_direction (float): Flight direction in degrees
        
    Returns:
        float: Headwind component in m/s (positive for headwind, negative for tailwind)
    """
    try:
        import math
        logger.debug(f"Calculating headwind: wind_speed={wind_speed}, wind_direction={wind_direction}, flight_direction={flight_direction}")
        
        # Check for None values and provide defaults
        if wind_speed is None:
            logger.warning("Wind speed is None, using 0")
            wind_speed = 0.0
            
        if wind_direction is None:
            logger.warning("Wind direction is None, using 0")
            wind_direction = 0.0
            
        if flight_direction is None:
            logger.warning("Flight direction is None, using 0")
            flight_direction = 0.0
            
        # Convert degrees to radians
        wind_rad = math.radians(wind_direction)
        flight_rad = math.radians(flight_direction)
        
        # Calculate headwind component
        # Headwind = wind_speed * cos(wind_direction - flight_direction)
        headwind = wind_speed * math.cos(wind_rad - flight_rad)
        logger.debug(f"Calculated headwind component: {headwind}")
        
        return headwind
    except Exception as e:
        logger.error(f"Error calculating headwind: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return 0.0  # Safe default

def get_enroute_weather(origin: str, destination: str, 
                       departure_time: datetime.datetime) -> Dict[str, Any]:
    """
    Get average weather conditions for a route (simplified).
    
    Args:
        origin (str): Origin airport code
        destination (str): Destination airport code
        departure_time (datetime.datetime): Departure time
        
    Returns:
        dict: Enroute weather features
    """
    logger.info(f"Getting enroute weather for {origin} to {destination}, departure time: {departure_time}")
    
    try:
        # Get weather at origin and destination
        logger.debug(f"Fetching origin weather for {origin}")
        origin_weather = get_weather(origin, departure_time)
        
        # Estimate arrival time (very rough approximation)
        # In a real system, this would use flight time estimates based on distance
        est_flight_time = 3  # hours, placeholder
        arrival_time = departure_time + datetime.timedelta(hours=est_flight_time)
        
        logger.debug(f"Estimated arrival time: {arrival_time}")
        logger.debug(f"Fetching destination weather for {destination}")
        destination_weather = get_weather(destination, arrival_time)
        
        # Calculate average/enroute conditions (simplified)
        logger.debug("Calculating average enroute conditions")
        enroute_weather = {}
        for key in origin_weather:
            if key in destination_weather and isinstance(origin_weather[key], (int, float)) and isinstance(destination_weather[key], (int, float)):
                enroute_weather[key] = (origin_weather[key] + destination_weather[key]) / 2
                logger.debug(f"Averaged {key}: origin={origin_weather[key]}, dest={destination_weather[key]}, avg={enroute_weather[key]}")
            else:
                enroute_weather[key] = origin_weather.get(key)
                logger.debug(f"Using origin value for {key}: {enroute_weather[key]}")
        
        # Add route-specific data
        if origin.upper() in AIRPORT_COORDS and destination.upper() in AIRPORT_COORDS:
            logger.debug("Both airports found in coordinates database")
            # Calculate approximate flight direction
            origin_lat, origin_lon = get_airport_coordinates(origin)
            dest_lat, dest_lon = get_airport_coordinates(destination)
            
            # Very simplified flight direction calculation
            # In production, use proper great circle calculations
            import math
            delta_lon = dest_lon - origin_lon
            y = math.sin(delta_lon) * math.cos(dest_lat)
            x = (math.cos(origin_lat) * math.sin(dest_lat) - 
                 math.sin(origin_lat) * math.cos(dest_lat) * math.cos(delta_lon))
            flight_direction = (math.degrees(math.atan2(y, x)) + 360) % 360
            logger.debug(f"Calculated flight direction: {flight_direction}°")
            
            # Calculate headwind component
            if 'wind_speed' in enroute_weather and 'wind_direction' in enroute_weather:
                enroute_weather['headwind'] = calculate_headwind(
                    enroute_weather['wind_speed'], 
                    enroute_weather['wind_direction'],
                    flight_direction
                )
                logger.debug(f"Calculated headwind component: {enroute_weather['headwind']}")
        else:
            logger.warning("One or both airports not found in coordinates database, skipping headwind calculation")
            
        return enroute_weather
        
    except Exception as e:
        logger.error(f"Error getting enroute weather: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return get_default_weather()

def get_default_weather() -> Dict[str, Any]:
    """
    Return default weather data when API fails.
    
    Returns:
        dict: Default weather features
    """
    logger.warning("Using default weather data due to errors")
    return {
        'temperature': 15.0,  # Celsius
        'humidity': 50,       # %
        'pressure': 1013.25,  # hPa (standard pressure)
        'wind_speed': 0.0,    # m/s
        'wind_direction': 0,  # degrees
        'weather_code': 800,  # Clear sky
        'weather_main': 'Clear',
        'weather_description': 'clear sky',
        'is_clear': 1,
        'is_cloudy': 0,
        'is_rainy': 0,
        'is_snowy': 0,
        'is_stormy': 0
    }
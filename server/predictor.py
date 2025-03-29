"""
Predictor Module for Aircraft Predictive Maintenance System

This module handles loading trained models and making predictions
for failure probability, RUL, and fuel consumption.
"""

import joblib
from pathlib import Path
import numpy as np
import pandas as pd
import logging
from data_preprocessing import prepare_failure_features, prepare_rul_features, prepare_fuel_features

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

MODELS_DIR = Path('models')

class PredictiveMaintenancePredictor:
    def __init__(self):
        logger.info("Initializing PredictiveMaintenancePredictor")
        try:
            # Load failure prediction model and related objects
            logger.info("Loading failure prediction models and objects")
            self.failure_model = joblib.load(MODELS_DIR / 'failure_model.joblib')
            self.failure_feature_names = joblib.load(MODELS_DIR / 'failure_feature_names.joblib')
            self.failure_explainer = joblib.load(MODELS_DIR / 'failure_explainer.joblib')
            
            # Load RUL prediction model and related objects
            logger.info("Loading RUL prediction models and objects")
            self.rul_model = joblib.load(MODELS_DIR / 'rul_model.joblib')
            self.rul_feature_names = joblib.load(MODELS_DIR / 'rul_feature_names.joblib')
            self.rul_explainer = joblib.load(MODELS_DIR / 'rul_explainer.joblib')
            
            # Load fuel prediction model and related objects
            logger.info("Loading fuel prediction models and objects")
            self.fuel_model = joblib.load(MODELS_DIR / 'fuel_model.joblib')
            self.fuel_feature_names = joblib.load(MODELS_DIR / 'fuel_feature_names.joblib')
            self.fuel_explainer = joblib.load(MODELS_DIR / 'fuel_explainer.joblib')
            self.fuel_threshold = joblib.load(MODELS_DIR / 'fuel_threshold.joblib')
            logger.info("All models loaded successfully")
        except Exception as e:
            logger.error(f"Error initializing predictor: {str(e)}", exc_info=True)
            raise

    def predict_failure(self, input_json, weather_data=None):
        """Predict probability of part failure."""
        logger.info(f"predict_failure called with input: {input_json}")
        logger.info(f"Weather data: {weather_data}")
        
        try:
            # Prepare features
            logger.info("Preparing features for failure prediction")
            features = prepare_failure_features(input_json, weather_data)
            logger.info(f"Prepared features: {features}")
            
            # Verify feature names match what the model expects
            logger.info(f"Expected feature names: {self.failure_feature_names}")
            missing_features = [f for f in self.failure_feature_names if f not in features]
            extra_features = [f for f in features.keys() if f not in self.failure_feature_names]
            if missing_features:
                logger.warning(f"Missing features: {missing_features}")
            if extra_features:
                logger.warning(f"Extra features not expected by model: {extra_features}")
                
            features_df = pd.DataFrame([features], columns=self.failure_feature_names)
            logger.info("Created features DataFrame")
            
            # Make prediction
            logger.info("Making prediction with failure model")
            failure_prob = self.failure_model.predict_proba(features_df)[0, 1]
            logger.info(f"Predicted failure probability: {failure_prob}")
            
            # Get SHAP explanation
            logger.info("Getting SHAP explanation")
            shap_values = self.failure_explainer.shap_values(features_df)
            if isinstance(shap_values, list):  # For binary classification
                logger.info("Processing SHAP values for binary classification")
                shap_values = shap_values[1]  # Get values for positive class
                
            # Format explanation
            logger.info("Formatting SHAP explanation")
            explanation = {
                name: float(value) 
                for name, value in zip(self.failure_feature_names, shap_values[0])
            }
            
            # Sort explanations by absolute magnitude and get top 5
            explanation = dict(sorted(
                explanation.items(),
                key=lambda x: abs(x[1]),
                reverse=True
            )[:5])
            
            # Generate recommendation
            logger.info("Generating recommendation based on failure probability")
            if failure_prob >= 0.2:  # 20% threshold for high risk
                recommendation = "Immediate maintenance check recommended."
            elif failure_prob >= 0.1:  # 10% threshold for moderate risk
                recommendation = "Schedule maintenance check within next week."
            else:
                recommendation = "No immediate maintenance needed. Perform routine check."
                
            result = {
                "failure_probability": float(failure_prob),
                "explanation": explanation,
                "recommendation": recommendation
            }
            logger.info(f"Returning prediction result: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error in predict_failure: {str(e)}", exc_info=True)
            raise

    def predict_rul(self, input_json):
        """Predict Remaining Useful Life."""
        # Prepare features
        features = prepare_rul_features(input_json)
        features_df = pd.DataFrame([features], columns=self.rul_feature_names)
        
        # Make prediction
        rul = self.rul_model.predict(features_df)[0]
        
        # Get SHAP explanation
        shap_values = self.rul_explainer.shap_values(features_df)
        
        # Format explanation
        explanation = {
            name: float(value)
            for name, value in zip(self.rul_feature_names, shap_values[0])
        }
        
        # Sort explanations by absolute magnitude and get top 5
        explanation = dict(sorted(
            explanation.items(),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:5])
        
        # Generate recommendation based on RUL
        if rul <= 10:  # Critical
            recommendation = "Schedule engine overhaul immediately."
        elif rul <= 50:  # Warning
            recommendation = f"Plan engine overhaul within next {max(1, int(rul/10))} weeks."
        else:  # Normal
            recommendation = "No immediate action needed."
            
        return {
            "rul_cycles": int(rul),
            "explanation": explanation,
            "maintenance_recommendation": recommendation
        }

    def predict_fuel(self, input_json, weather_data=None):
        """Predict fuel consumption and detect anomalies."""
        # Prepare features
        features = prepare_fuel_features(input_json, weather_data)
        features_df = pd.DataFrame([features], columns=self.fuel_feature_names)
        
        # Make prediction
        predicted_fuel = self.fuel_model.predict(features_df)[0]
        
        # Get SHAP explanation
        shap_values = self.fuel_explainer.shap_values(features_df)
        
        # Format explanation
        explanation = {
            name: float(value)
            for name, value in zip(self.fuel_feature_names, shap_values[0] if isinstance(shap_values, list) else shap_values)
        }
        
        # Sort explanations by absolute magnitude and get top 5
        explanation = dict(sorted(
            explanation.items(),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:5])
        
        # Calculate baseline fuel for this route/aircraft
        baseline_features = features.copy()
        if weather_data:  # Remove weather impact for baseline
            baseline_features['temperature'] = 15  # Standard temperature
            baseline_features['wind_speed'] = 0
            baseline_features['wind_direction'] = 0
        baseline_df = pd.DataFrame([baseline_features], columns=self.fuel_feature_names)
        baseline_fuel = self.fuel_model.predict(baseline_df)[0]
        
        # Determine if consumption is abnormally high
        fuel_difference = predicted_fuel - baseline_fuel
        high_fuel_flag = fuel_difference > self.fuel_threshold
        
        return {
            "predicted_fuel": float(predicted_fuel),
            "units": "kg",
            "high_fuel_flag": bool(high_fuel_flag),
            "explanation": explanation,
            "baseline_fuel": float(baseline_fuel),
            "fuel_difference": float(fuel_difference)
        }

# Initialize predictor as a singleton
predictor = PredictiveMaintenancePredictor()
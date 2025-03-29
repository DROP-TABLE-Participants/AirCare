"""
Custom utilities for model training when standard libraries are not available.
"""

import numpy as np
import pandas as pd

def train_test_split(X, y, test_size=0.2, random_state=None):
    """
    Split arrays or matrices into random train and test subsets.
    
    Parameters
    ----------
    X : DataFrame, array-like
        Features data
    y : DataFrame, array-like
        Target data
    test_size : float, default=0.2
        Proportion of the dataset to include in the test split
    random_state : int, default=None
        Controls the shuffling applied to the data before applying the split
        
    Returns
    -------
    X_train, X_test, y_train, y_test : DataFrames or arrays
        The train and test splits of the input data
    """
    if random_state is not None:
        np.random.seed(random_state)
    
    # Convert to pandas DataFrames if they're not already
    if not isinstance(X, pd.DataFrame):
        X = pd.DataFrame(X)
    if not isinstance(y, pd.DataFrame) and not isinstance(y, pd.Series):
        y = pd.Series(y)
    
    # Get indices for all samples
    indices = np.arange(X.shape[0])
    
    # Shuffle indices
    np.random.shuffle(indices)
    
    # Calculate split point
    test_count = int(X.shape[0] * test_size)
    
    # Split indices
    test_indices = indices[:test_count]
    train_indices = indices[test_count:]
    
    # Split data
    X_train = X.iloc[train_indices]
    X_test = X.iloc[test_indices]
    
    # Handle Series vs DataFrame for y
    if isinstance(y, pd.Series):
        y_train = y.iloc[train_indices]
        y_test = y.iloc[test_indices]
    else:
        y_train = y.iloc[train_indices]
        y_test = y.iloc[test_indices]
    
    return X_train, X_test, y_train, y_test

class StandardScaler:
    """
    Standardize features by removing the mean and scaling to unit variance.
    
    Parameters
    ----------
    with_mean : bool, default=True
        If True, center the data before scaling
    with_std : bool, default=True
        If True, scale the data to unit variance
    """
    def __init__(self, with_mean=True, with_std=True):
        self.with_mean = with_mean
        self.with_std = with_std
        self.mean_ = None
        self.scale_ = None
    
    def fit(self, X):
        """
        Compute the mean and std to be used for later scaling.
        
        Parameters
        ----------
        X : {array-like, DataFrame} of shape (n_samples, n_features)
            The data used to compute the mean and standard deviation
        
        Returns
        -------
        self : object
            Fitted scaler
        """
        if isinstance(X, pd.DataFrame):
            X_array = X.values
        else:
            X_array = np.asarray(X)
        
        if self.with_mean:
            self.mean_ = np.mean(X_array, axis=0)
        else:
            self.mean_ = np.zeros(X_array.shape[1])
        
        if self.with_std:
            self.scale_ = np.std(X_array, axis=0)
            # Avoid division by zero
            self.scale_ = np.where(self.scale_ == 0, 1.0, self.scale_)
        else:
            self.scale_ = np.ones(X_array.shape[1])
        
        return self
    
    def transform(self, X):
        """
        Perform standardization by centering and scaling.
        
        Parameters
        ----------
        X : {array-like, DataFrame} of shape (n_samples, n_features)
            The data to scale
        
        Returns
        -------
        X_scaled : ndarray or DataFrame of shape (n_samples, n_features)
            Scaled data
        """
        if self.mean_ is None or self.scale_ is None:
            raise ValueError("StandardScaler instance is not fitted yet. Call 'fit' first.")
        
        is_dataframe = isinstance(X, pd.DataFrame)
        if is_dataframe:
            columns = X.columns
            index = X.index
            X_array = X.values
        else:
            X_array = np.asarray(X)
        
        # Standardize
        X_scaled = (X_array - self.mean_) / self.scale_
        
        if is_dataframe:
            return pd.DataFrame(X_scaled, index=index, columns=columns)
        return X_scaled

class LabelEncoder:
    """
    Encode target labels with value between 0 and n_classes-1.
    """
    def __init__(self):
        self.classes_ = None
        self._label_to_index = None
    
    def fit(self, y):
        """
        Fit label encoder.
        
        Parameters
        ----------
        y : array-like of shape (n_samples,)
            Target values
        
        Returns
        -------
        self : returns an instance of self
        """
        self.classes_ = np.unique(y)
        self._label_to_index = {label: idx for idx, label in enumerate(self.classes_)}
        return self
    
    def fit_transform(self, y):
        """
        Fit label encoder and return encoded labels.
        
        Parameters
        ----------
        y : array-like of shape (n_samples,)
            Target values
        
        Returns
        -------
        y_encoded : array of shape (n_samples,)
            Encoded target values
        """
        self.fit(y)
        return self.transform(y)
    
    def transform(self, y):
        """
        Transform labels to normalized encoding.
        
        Parameters
        ----------
        y : array-like of shape (n_samples,)
            Target values
        
        Returns
        -------
        y_encoded : array of shape (n_samples,)
            Encoded target values
        """
        if self.classes_ is None:
            raise ValueError("LabelEncoder not fitted. Call 'fit' first.")
        
        # For values not seen during fit, return -1 or a specific "unknown" value
        if hasattr(y, "__len__"):
            return np.array([self._label_to_index.get(label, -1) for label in y])
        else:
            return self._label_to_index.get(y, -1)
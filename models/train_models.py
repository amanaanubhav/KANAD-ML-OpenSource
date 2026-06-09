import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

def train_and_save_rf_model():
    """
    Trains the Random Forest model for Crop Recommendation and saves it.
    This replaces the original Jupyter Notebook training logic to fix 
    scikit-learn version mismatches.
    """
    print("Loading crop recommendation dataset...")
    data_path = os.path.join(os.path.dirname(__file__), '..', 'Data-processed', 'crop_recommendation.csv')
    df = pd.read_csv(data_path)

    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    print("Training Random Forest model (n_estimators=20, random_state=0)...")
    model = RandomForestClassifier(n_estimators=20, random_state=0)
    model.fit(X, y)

    acc = model.score(X, y)
    print(f"Accuracy on training set: {acc:.4f}")

    model_path = os.path.join(os.path.dirname(__file__), 'RandomForest.pkl')
    print(f"Saving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print("Model successfully saved!")

if __name__ == "__main__":
    train_and_save_rf_model()

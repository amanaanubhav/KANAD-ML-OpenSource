import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

print("Loading dataset...")
df = pd.read_csv('../Data-processed/crop_recommendation.csv')

X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

print("Training Random Forest model...")
model = RandomForestClassifier(n_estimators=20, random_state=0)
model.fit(X, y)

print(f"Accuracy on training set: {model.score(X, y):.4f}")

model_path = 'models/RandomForest.pkl'
print(f"Saving model to {model_path}...")
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print("Model successfully retrained and saved!")

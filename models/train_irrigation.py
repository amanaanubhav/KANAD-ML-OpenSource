"""
Training script for the LSTM irrigation prediction model.

Generates synthetic training data based on known crop water needs and
environmental factors, then trains the LSTM model.

Run: python train_irrigation.py
"""

import os
import sys
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

# Add parent directory to path so we can import from app
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.utils.irrigation_model import (
    IrrigationLSTM, CROP_WATER_BASELINE, CROP_TYPES,
    INPUT_SIZE, SEQUENCE_LENGTH, NUM_CROP_TYPES
)

def generate_training_data(num_samples=5000, seq_length=SEQUENCE_LENGTH):
    """
    Generate synthetic training data for the LSTM model.

    Each sample is a sequence of (soil_moisture, temperature, humidity,
    crop_type_norm, recent_water_usage, rainfall) → (water_needed, duration).
    """
    X = []
    y = []

    crop_names = list(CROP_WATER_BASELINE.keys())

    for _ in range(num_samples):
        # Random crop
        crop_name = np.random.choice(crop_names)
        crop_id = CROP_TYPES.get(crop_name, 0)
        crop_norm = crop_id / NUM_CROP_TYPES
        baseline_water = CROP_WATER_BASELINE[crop_name]

        # Random environmental conditions
        base_temp = np.random.uniform(15, 42)
        base_humidity = np.random.uniform(30, 95)
        base_moisture = np.random.uniform(10, 90)
        base_rainfall = np.random.uniform(0, 100)
        base_water_used = np.random.uniform(0, 10)

        sequence = []
        for t in range(seq_length):
            # Add temporal variation
            temp = np.clip(base_temp + np.random.normal(0, 2), 5, 50)
            humidity = np.clip(base_humidity + np.random.normal(0, 3), 10, 100)
            moisture = np.clip(base_moisture - t * 0.5 + np.random.normal(0, 2), 5, 100)
            rainfall = max(0, base_rainfall + np.random.normal(0, 10))
            water_used = max(0, base_water_used + np.random.normal(0, 1))

            # Normalize
            features = [
                moisture / 100.0,
                temp / 50.0,
                humidity / 100.0,
                crop_norm,
                min(water_used / 20.0, 1.0),
                min(rainfall / 300.0, 1.0)
            ]
            sequence.append(features)

        X.append(sequence)

        # Target: water needed and duration
        # Based on physics-inspired heuristic
        final_moisture = sequence[-1][0] * 100  # denormalize
        final_temp = sequence[-1][1] * 50

        moisture_factor = max(0.1, 1.0 - final_moisture / 100.0)
        rain_factor = max(0.1, 1.0 - base_rainfall / 200.0)
        temp_factor = 1.0 + max(0, (final_temp - 25) * 0.03)

        water_needed = max(0.5, baseline_water * moisture_factor * rain_factor * temp_factor)
        duration = max(5, water_needed * 8)  # ~8 minutes per liter

        # Add some noise to targets
        water_needed += np.random.normal(0, 0.3)
        duration += np.random.normal(0, 2)

        y.append([max(0.1, water_needed), max(3, duration)])

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)


def train_model(epochs=50, batch_size=64, lr=0.001):
    """Train the LSTM model and save weights."""
    print("=" * 60)
    print("KANAD - LSTM Irrigation Model Training")
    print("=" * 60)

    # Generate training data
    print("\n[1/4] Generating synthetic training data...")
    X_train, y_train = generate_training_data(num_samples=5000)
    X_val, y_val = generate_training_data(num_samples=1000)
    print(f"  Training samples: {len(X_train)}")
    print(f"  Validation samples: {len(X_val)}")
    print(f"  Sequence length: {SEQUENCE_LENGTH}")
    print(f"  Input features: {INPUT_SIZE}")

    # Create datasets
    train_dataset = TensorDataset(torch.FloatTensor(X_train), torch.FloatTensor(y_train))
    val_dataset = TensorDataset(torch.FloatTensor(X_val), torch.FloatTensor(y_val))

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    # Initialize model
    print("\n[2/4] Initializing LSTM model...")
    model = IrrigationLSTM()
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=15, gamma=0.5)

    total_params = sum(p.numel() for p in model.parameters())
    print(f"  Parameters: {total_params:,}")
    print(f"  Architecture: {model.num_layers} LSTM layers, hidden={model.hidden_size}")

    # Training loop
    print(f"\n[3/4] Training for {epochs} epochs...")
    best_val_loss = float('inf')

    for epoch in range(epochs):
        # Training
        model.train()
        train_loss = 0
        for batch_X, batch_y in train_loader:
            optimizer.zero_grad()
            output = model(batch_X)
            loss = criterion(output, batch_y)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            train_loss += loss.item()

        train_loss /= len(train_loader)

        # Validation
        model.eval()
        val_loss = 0
        with torch.no_grad():
            for batch_X, batch_y in val_loader:
                output = model(batch_X)
                loss = criterion(output, batch_y)
                val_loss += loss.item()
        val_loss /= len(val_loader)

        scheduler.step()

        if (epoch + 1) % 10 == 0 or epoch == 0:
            print(f"  Epoch {epoch+1:3d}/{epochs} | "
                  f"Train Loss: {train_loss:.4f} | "
                  f"Val Loss: {val_loss:.4f} | "
                  f"LR: {scheduler.get_last_lr()[0]:.6f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss

    # Save model
    print(f"\n[4/4] Saving model...")
    model_dir = os.path.dirname(__file__)
    model_path = os.path.join(model_dir, 'irrigation_lstm.pth')
    torch.save(model.state_dict(), model_path)

    file_size = os.path.getsize(model_path) / 1024
    print(f"  Saved to: {model_path}")
    print(f"  File size: {file_size:.1f} KB")
    print(f"  Best validation loss: {best_val_loss:.4f}")

    # Generate demo sensor data
    print("\n[Bonus] Generating demo sensor data...")
    from app.utils.irrigation_store import generate_demo_sensor_data
    generate_demo_sensor_data(days=14)

    print("\n" + "=" * 60)
    print("Training complete! Model is ready for deployment.")
    print("=" * 60)


if __name__ == '__main__':
    train_model()

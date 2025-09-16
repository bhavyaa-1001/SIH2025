import pickle
import os
import sys
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split

# Import the necessary functions and data from untitled3.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load data
try:
    data = pd.read_excel('Meta_data_without_sg_cleaned_final.xlsx')
    print("Data loaded successfully")
except Exception as e:
    print(f"Error loading data: {e}")
    # Try to find the file
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.xlsx') and 'Meta_data' in file:
                print(f"Found potential data file: {os.path.join(root, file)}")
    sys.exit(1)

# Process data similar to untitled3.py
if 'dg' in data.columns:
    data = data.drop(columns=['dg'])

if 'Code' in data.columns:
    data = data.drop(columns=['Code'])

# Define the custom texture class encoding mapping
custom_texture_encoding = {
    "SANDY LOAMY": 6,
    "SANDY CLAY": 5,
    "LOAM": 2,
    "CLAY LOAM": 1,
    "CLAY": 0,
    "SILTY LOAM": 9,
    "LOAMY SAND": 3,
    "SILTY CLAY LOAM": 8,
    "SILTY CLAY": 7,
    "SAND": 4,
    "SANDY LOAM": 10,
    "SANDY CLAY LOAM": 11,
    "Unknown": -1
}

# Check if 'Texture Class' exists and rename it to 'Texture'
if 'Texture Class' in data.columns:
    data = data.rename(columns={'Texture Class': 'Texture'})

# Apply the encoding to the 'Texture' column if it exists
if 'Texture' in data.columns:
    data['Texture Encoded'] = data['Texture'].map(custom_texture_encoding).fillna(custom_texture_encoding["Unknown"])
    data = data.drop(columns=['Texture'])
else:
    print("Warning: 'Texture Class' or 'Texture' column not found in the DataFrame.")
    data['Texture Encoded'] = custom_texture_encoding["Unknown"]

# Define the desired column order
desired_column_order = ['Clay', 'Silt', 'Sand', 'Texture Encoded', 'OC', 'Ksat']

# Reindex the DataFrame to the desired column order
data = data.reindex(columns=[col for col in desired_column_order if col in data.columns])

# Separate features (X) and target (y)
if 'Ksat' in data.columns:
    X = data.drop(columns=['Ksat'])
    y = data['Ksat']
else:
    print("Error: 'Ksat' column not found in the DataFrame.")
    sys.exit(1)

# Ensure the 'OC' column is numeric
X['OC'] = pd.to_numeric(X['OC'], errors='coerce')
X = X.dropna(subset=['OC'])
y = y[X.index]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define best parameters (from untitled3.py)
best_params = {
    "verbosity": 0,
    "objective": "reg:squarederror",
    "eval_metric": "rmse",
    "booster": "gbtree",
    "max_depth": 8,
    "learning_rate": 0.1,
    "n_estimators": 500,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "gamma": 0,
    "reg_alpha": 0,
    "reg_lambda": 1,
    "min_child_weight": 1,
}

# Train the model
print("Training the model...")
final_model = xgb.XGBRegressor(**best_params, random_state=42, n_jobs=-1)
final_model.fit(X_train, y_train)

# Save the model
model_path = 'model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(final_model, f)

print(f"Model saved to {model_path}")
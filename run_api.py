import os
import sys
import uvicorn

 

# Add the current directory to the path so we can import from api
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting FastAPI server...")
    print("Make sure you've run save_model.py first to create the model.pkl file")
    uvicorn.run("api.app:app", host="0.0.0.0", port=8000, reload=True)
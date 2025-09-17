from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after=-1)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

app = FastAPI()

@app.get("/")
def get_annual_rainfall(lat: float, lon: float):
    """
    Accepts latitude and longitude, returns the average annual rainfall.
    """
    try:
        # Define the API request parameters
        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": "2000-01-01",
            "end_date": "2023-12-31",
            "daily": "precipitation_sum",
            "timezone": "auto"
        }
        
        # Fetch the data
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]

        # Process the response
        daily = response.Daily()
        daily_precipitation_sum = daily.Variables(0).ValuesAsNumpy()

        daily_data = {
            "date": pd.to_datetime(daily.Time(), unit="s", utc=True),
            "precipitation_sum": daily_precipitation_sum
        }

        daily_dataframe = pd.DataFrame(data=daily_data)
        
        # Check if the dataframe is empty
        if daily_dataframe.empty or daily_dataframe["precipitation_sum"].isnull().all():
            raise HTTPException(status_code=404, detail="No precipitation data found for the given coordinates.")

        # Calculate the average annual rainfall
        annual_rainfall = daily_dataframe.groupby(daily_dataframe['date'].dt.year)['precipitation_sum'].sum().mean()

        return {"annual_rainfall": round(annual_rainfall, 2)}

    except Exception as e:
        # Catch any exceptions and return a proper HTTP error
        return JSONResponse(
            status_code=500,
            content={"error": "An error occurred while fetching or processing weather data.", "details": str(e)}
        )
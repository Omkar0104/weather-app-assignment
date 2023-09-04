const express = require("express");
const cors = require("cors");
// const fetch = require("node-fetch");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define a POST endpoint to fetch weather data
app.post("/getWeather", async (req, res) => {
  try {
    // Retrieve the list of cities from the request body
    const cities = req.body;
    console.log(cities);

    // Fetch weather data for each city (replace with your API)
    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const apiKey = "06eb48fc720345238ea63202230409";
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );
        const data = await response.json();
        // return data;
        return { [city]: data.current.temp_c + "°C" };
      })
    );

    // Prepare the response
    const weatherResponse = { weather: {} };
    weatherData.forEach((data) => {
      Object.assign(weatherResponse.weather, data);
    });

    // Send the response
    res.json(weatherResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

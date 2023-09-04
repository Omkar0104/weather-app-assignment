const express = require("express");
const cors = require("cors");
// const fetch = require("node-fetch");
const axios = require('axios');

const app = express();

app.use(cors());

app.use(express.json());

app.post("/getWeather", async (req, res) => {
  try {
    const cities = req.body;
    // console.log(cities);

    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const apiKey = "06eb48fc720345238ea63202230409";
        // const response = await fetch(
        //   `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        // );
         const response = await axios.get(
           `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
         );
        //  console.log(response.data);
        const data =  response.data;
        // return data;
        return { [city]: data.current.temp_c + "°C" };
      })
    );

    
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

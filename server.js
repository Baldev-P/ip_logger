const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to log IP, geolocation, country, and time
app.use(async (req, res, next) => {
    // Get client IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('IPAddress:', ipAddress);      
  
    try {
      // Get geolocation and country information using ipinfo.io API
      const [responseIpInfo] = await Promise.all([axios.get(`https://ipinfo.io/${ipAddress}/json`)]);
      const { city, region, country, loc } = responseIpInfo.data || {};
      console.log('IPinfo.io API Response:', response.data);      
  
      // Log IP, geolocation, country, and time
      console.log(`IP: ${ipAddress}, Geolocation: ${loc}, City: ${city}, Region: ${region}, Country: ${country}, Time: ${new Date().toLocaleString()}`);
  
      // Attach details to the request object for further processing if needed
      req.ipDetails = {
        ipAddress,
        geolocation: loc,
        city,
        region,
        country,
        time: new Date().toLocaleString(),
      };
    } catch (error) {
      console.error('Error fetching IP information:', error.message);
    }
  
    next();
  });


// Route to handle incoming requests and send JSON response
app.get('/', (req, res) => {
  // Retrieve details from the request object
  const { ipAddress, geolocation, city, region, country, time } = req.ipDetails || {};

  // Send details as JSON response
  res.json({
    ipAddress,
    geolocation,
    city,
    region,
    country,
    time,
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

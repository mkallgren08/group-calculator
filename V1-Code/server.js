const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
const firebase = require("firebase")

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve up static assets
app.use(express.static("client/build"));
// Add routes, both API and view
app.use(routes);


// Initialize Firebase
var config = {
  apiKey: process.env.GRP_CALC_APIKEY,
  authDomain: "group-calculator.firebaseapp.com",
  databaseURL: "https://group-calculator.firebaseio.com",
  projectId: "group-calculator",
  storageBucket: "group-calculator.appspot.com",
};
firebase.initializeApp(config);

// Initialize Database
const database = firebase.database();

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

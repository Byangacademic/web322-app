/*********************************************************************************
 *  WEB322 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Benny Yang Student ID: 112654223 Date: June 1 2023
 *
 * ONLINE (CYCLIC) LINK: https://lazy-tan-fox-belt.cyclic.app
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var storeService = require("./store-service");

app.use(express.static("public"));

// Redirect to /about
app.get("/", (req, res) => {
  res.redirect("/about");
});

// The about page
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

// shop route
app.get("/shop", (req, res) => {
  storeService.getPublishedItems().then((data) => {
    res.send(data);
  });
});

// items route
app.get("/items", (req, res) => {
  storeService.getAllItems().then((data) => {
    res.send(data);
  });
});

// categories route
app.get("/categories", (req, res) => {
  storeService
    .getCategories()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error("Failed to get categories:", error);
      res.status(500).sendFile(__dirname + "/views/OOF.html");
    });
});

app.get("*", (req, res) => {
  res.status(404).sendFile(__dirname + "/views/404.html");
});

// Setup http server to listen to HTTP_PORT
storeService.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Express http server listening on port ${HTTP_PORT}`);
  });
})
.catch((err) => "Server failed to init from: " + err);

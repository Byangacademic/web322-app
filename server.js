/*********************************************************************************
 *  WEB322 – Assignment 3
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Benny Yang Student ID: 112654223 Date: June 14 2023
 *
 * ONLINE (CYCLIC) LINK: https://lazy-tan-fox-belt.cyclic.app
 *
 ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const upload = multer();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
var storeService = require("./store-service");

cloudinary.config({
  cloud_name: "daf6jhhxk",
  api_key: "588681381715112",
  api_secret: "e3ulwVGfU2LOcMk657YybzpxVsY",
  secure: true,
});

app.use(express.static("public"));

// Redirect to /about
app.get("/", (req, res) => {
  res.redirect("/about");
});

// The about page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// shop route
app.get("/shop", (req, res) => {
  storeService
    .getPublishedItems()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error("Failed to get categories:", error);
      res.status(500).sendFile(__dirname + "/views/OOF.html");
    });
});

// items route
app.get("/items", (req, res) => {
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    storeService
      .getItemsByCategory(category)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error("Failed to get items of selected category:", error);
        res.status(500).sendFile(__dirname + "/views/OOF.html");
      });
  } else if (minDate) {
    storeService
      .getItemsByMinDate(minDate)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error("Failed to get items of selected minDate:", error);
        res.status(500).sendFile(__dirname + "/views/OOF.html");
      });
  } else {
    storeService
      .getAllItems()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error("Failed to get categories:", error);
        res.status(500).sendFile(__dirname + "/views/OOF.html");
      });
  }
});

// items add route
app.get("/items/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addItem.html"));
});

//items add post
app.post("/items/add", upload.single("featureImage"), (req, res) => {
  // GIVEN CODE HERE
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }
    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;
    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    // SELF ADDED CODE HERE
    storeService
      .addItem(req.body)
      .then(() => {
        res.redirect("/items");
      })
      .catch((err) => {
        console.error("Failed to add item:", err);
        res.status(500).sendFile(path.join(__dirname, "views", "OOF.html"));
      });
  }
});

app.get("/item/:id", (req, res) => {
  const itemId = req.params.id;
  storeService
    .getItemById(itemId)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({error: "Item not found"});
      }
    })
    .catch((error) => {
      console.error("Failed to get item of this id:", error);
      res.status(500).sendFile(path.join(__dirname, "views", "OOF.html"));
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
      res.status(500).sendFile(path.join(__dirname, "views", "OOF.html"));
    });
});

// CATCH ALL
app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Setup http server to listen to HTTP_PORT
storeService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => "Server failed to init from: " + err);

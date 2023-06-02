/*********************************************************************************
 *  WEB322 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Benny Yang Student ID: 112654223 Date: June 1 2023
 *
 *
 ********************************************************************************/

const fs = require("fs");
const path = require("path");

let items = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    const itemsFilePath = path.join(__dirname, "data", "items.json");
    const catFilePath = path.join(__dirname, "data", "categories.json");

    fs.readFile(itemsFilePath, "utf8", (err, itemsData) => {
      if (err) {
        reject("Unable to read items file");
        return;
      }
      items = JSON.parse(itemsData);

      fs.readFile(catFilePath, "utf8", (err, catData) => {
        if (err) {
          reject("Unable to read categories file");
          return;
        }
        categories = JSON.parse(catData);
        resolve();
      });
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No item results returned");
      return;
    }
    resolve(items);
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter((item) => item.published === true);

    if (publishedItems.length === 0) {
      reject("No published item results returned");
      return;
    }
    resolve(publishedItems);
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
        reject("No category results returned");
        return;
    }
    resolve(categories);
  });
}

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
};

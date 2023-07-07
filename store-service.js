/*********************************************************************************
 *  WEB322 – Assignment 4
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Benny Yang Student ID: 112654223 Date: July 5 2023
 *
 * ONLINE (CYCLIC) LINK: https://lazy-tan-fox-belt.cyclic.app
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
      reject("No category results returned");
      return;
    }
    resolve(categories);
  });
}

function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No items results returned");
      return;
    }
    let results = items.filter((item) => item.category == category);
    if (results.length === 0) {
      reject("Nothing Found here babe");
    }
    resolve(results);
  });
}

function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No items results returned");
      return;
    }

    let results = items.filter(
      (item) => new Date(item.postDate) >= new Date(minDateStr)
    );
    if (results.length === 0) {
      reject("Nothing Found here babe");
    }
    resolve(results);
  });
}

function getItemById(id) {
  return new Promise((resolve, reject) => {
    let result = items.find((item) => item.id == id);
    if (result) {
      resolve(result);
    } else {
      reject("Item not found");
    }
  });
}

function addItem(itemData) {
  return new Promise((resolve, reject) => {
    itemData.published = itemData.published == undefined ? false : true;
    itemData.id = items.length + 1;
    let date = new Date();
    // Get year, month, and day part from the date
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    itemData.postDate = year + "-" + month + "-" + day;
    items.push(itemData);
    resolve(items);
  });
}

function getPublishedItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    let publishedCatItems = items.filter(
      (item) => item.published == true && item.category == category
    );
    if (publishedCatItems.length === 0) {
      reject("No published item results returned");
      return;
    }
    resolve(publishedCatItems);
  });
}

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
  addItem,
  getPublishedItemsByCategory,
};

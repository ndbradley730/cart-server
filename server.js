'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');

// Constants
const ITEM_CATALOG = JSON.parse(fs.readFileSync('items.json', 'utf8'));
const CART_FILENAME = 'cart.json';
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.json());
app.use(express.static('static'));

app.get('/api/v1/items', function (req, res) {
  res.json(ITEM_CATALOG);
});

app.get('/api/v1/cart', function (req, res) {
  fs.readFile(CART_FILENAME, 'utf8', function(err, contents) {
    if (contents) {
      res.json(JSON.parse(contents));
    } else {
      res.json([]);
    }
  });
});

app.put('/api/v1/cart', function (req, res) {
  // If no quantity specified, add one
  fs.readFile(CART_FILENAME, 'utf8', function(err, contents) {
    let cart = [];
    if (contents) {
      cart = JSON.parse(contents);
    }

    let matchingCartItems = cart.filter(function(item) {
      return item.id == req.body.id;
    });

    if (matchingCartItems.length > 0) {
      let matchingCartItem = matchingCartItems[0];
      if (req.body.quantity) {
        matchingCartItem.quantity = req.body.quantity;
      } else {
        matchingCartItem.quantity++;
      }
    } else {
      // Add new item
      req.body.quantity = 1;
      cart.push(req.body);
    }

    fs.writeFile(CART_FILENAME, JSON.stringify(cart), function (err) {
      if (err) {
        console.error(err);
      }
      res.send('');
    });
  });
});

app.delete('/api/v1/cart/:itemId', function (req, res) {
  fs.readFile(CART_FILENAME, 'utf8', function(err, contents) {
    if (!contents) {
      return;
    }
    let cart = JSON.parse(contents);

    cart = cart.filter(function(item) {
      return item.id != req.params.itemId;
    });

    fs.writeFile(CART_FILENAME, JSON.stringify(cart), function (err) {
      if (err) {
        console.error(err);
      }
      res.send('');
    });
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

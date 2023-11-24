"use strict";

const auth = require("./auth");
const clientCredential = require("./client-credential");
const tokenStore = require("./token-store");

module.exports = {
  auth,
  "client-credential": clientCredential,
  "token-store": tokenStore,
};

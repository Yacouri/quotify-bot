const express = require("express");

const server = express();

const runServer = () => {
  server.all("/", (req, res) => {
    server.listen(3000, () => {
      console.log("[+] Server is running!");
    });
  });
};

module.exports = runServer;

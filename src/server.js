const express = require("express");
const projectRoutes = require("./projects");
const filesRoutes = require ("./files")
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler,
} = require("./errorHandling.js");

const server = express();
const port = 4000;

server.use(express.json());
server.use("/projects", projectRoutes);
server.use("/files", filesRoutes)
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(badRequestHandler);
server.use(catchAllHandler);

server.listen(port, () => {
  console.log("port is : ", port);
});
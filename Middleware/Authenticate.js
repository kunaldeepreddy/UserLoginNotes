const jwt = require("jsonwebtoken");
var CONSTANT = require('../constant.js');
module.exports = function (req, res, next) {
  //console.log("req ",req)
  const tokenSplit = req.headers.authorization.split(" ");
  var token = tokenSplit[1];
  if (!token) return res.status(400).send("Access Denied!");

  try {
    const verified = jwt.verify(token, CONSTANT.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({status: false, error: "auth failed, check authorization token" });
  }
};
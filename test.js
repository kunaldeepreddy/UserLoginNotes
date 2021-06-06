console.log(require('crypto').randomBytes(256).toString('base64'));
var uuid = require('node-uuid')
var secretKey = uuid.v4();
console.log("secretKey ",secretKey)
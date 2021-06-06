const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
//console.log("env "+process.env.SECRETKEY+" "+process.env.KEY_ID);
module.exports = Object.freeze({
   DB_URL: process.env.MONGODB_URL,
   SECRET_KEY: process.env.SECRET_KEY
});
const mongoose = require('mongoose');
require("dotenv").config();
mongoose.set("strictQuery", true);

const connection = mongoose.connect("mongodb+srv://omhari:iqoo@cluster0.ej7gnt2.mongodb.net/Beauty?retryWrites=true&w=majority");

module.exports = {
 connection
}
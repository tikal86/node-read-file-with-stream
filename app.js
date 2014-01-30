/*jslint node: true es5:true nomen: true*/
"use strict";

var fs = require("fs");
 
// Read File
fs.createReadStream("input/0635287609_01-01-2013_31-12-2013.csv")
    // Write File
    .pipe(fs.createWriteStream("output/asnbank_2013.csv"));

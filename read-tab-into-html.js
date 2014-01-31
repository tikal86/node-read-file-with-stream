/*jslint node: true es5:true nomen: true*/
"use strict";

var fs = require("fs");
var es = require("event-stream");
var vsprintf = require("sprintf").vsprintf;
 
// Read File
fs.createReadStream("input/people.tsv")
    // Split Strings
    .pipe(es.split("\n"))
    // Split Strings into Array
    .pipe(es.mapSync(function (data) {
        return data.split("\t");
    }))
    // Convert Array w/ Sprintf
    .pipe(es.mapSync(function (data) {
        return vsprintf("<tr><td><a href='%2$s'>%1$s</a></td><td>%3$s</td></tr>", data);
    }))
    // Join Strings
    .pipe(es.join("\n"))
    // Concat Strings
    .pipe(es.wait(function (err, text) {
        // have complete text here.
        console.log(text);
    }))
    // Wrap Strings
    .pipe(es.mapSync(function (data) {
        return "<table><tr><th>Name</th><th>City</th></tr>\n" + data + "\n</table>";
    }))
    // Write File
    .pipe(fs.createWriteStream("output/table.html"));

/*jslint node: true es5:true nomen: true*/
"use strict";

var request = require("request");
var fs = require("fs");
var csv = require("csv-streamify");
var es = require("event-stream");
 
var tmpl = Handlebars.compile("<tr><td><a href='{{URL}}'>{{Name}}</a></td><td>{{City}}</td></tr>");
 
// HTTP GET Request
request("http://www.google.org/flutrends/us/data.txt")
    // Parse CSV as Object
    .pipe(csv({objectMode: true, columns: true}))
    // Convert Object w/ Handlebars
    .pipe(es.mapSync(tmpl))
    // Join Strings
    .pipe(es.join("\n"))
    // Concat Strings
    .pipe(es.wait())
    // Wrap Strings
    .pipe(es.mapSync(function (data) {
        return "<table><tr><th>Name</th><th>City</th></tr>\n" + data + "\n</table>";
    }))
    // Write File
    .pipe(fs.createWriteStream("output/table.html"));

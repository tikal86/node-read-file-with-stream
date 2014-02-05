/*jslint node: true es5:true nomen: true*/
"use strict";

var request = require("request");
var fs = require("fs");
var zlib = require("zlib");
// Werkt nog niet, heeft native conmpilatie nodig.
//var Iconv = require("iconv").Iconv;
// Ondersteund EUC-JP niet
//var iconv = require("iconv-lite");
var csv = require("csv-streamify");
var Handlebars = require("handlebars");
var es = require("event-stream");
 
var tmpl = Handlebars.compile("<tr><td><a href='{{URL}}'>{{Name}}</a></td><td>{{City}}</td></tr>");
 
// HTTP GET Request
request("http://nodestreams.com/input/people_euc-jp.csv.gz")
    // Un-Gzip
    .pipe(zlib.createGunzip())
//    // Change Encoding
//    .pipe(new Iconv("EUC-JP", "UTF-8"))
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

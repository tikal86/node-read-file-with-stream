/*jslint node: true es5:true nomen: true*/
"use strict";

var request = require("request"),
    fs = require("fs"),
    csv = require("csv-streamify"),
    es = require("event-stream"),
    flutable = require("./flutable"),
    Transform = require('stream').Transform,
    express = require('express'),
    path = require('path'),
    d3 = require('d3'),
    jsdom = require('jsdom');

var app = express();
app.set('port', 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/', function (req, res) {
// http://pothibo.com/2013/09/d3-js-how-to-handle-dynamic-json-data/
    var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><button class="add-data">Add data</button><script src="js/d3.v3.min.js"></script><script src="js/d3.v3.min.js"></script></body></html>';
    // pass the html stub to jsDom
    jsdom.env({ features : { QuerySelector : true }, html : htmlStub, done : function (errors, window) {
        // process the html document, like if we were at client side
        // code to generate the dataviz and process the resulting html file to be added here
        var el = window.document.querySelector('#dataviz-container'), body = window.document.querySelector('body');

        var JSONData = [
            { "id": 3, "created_at": "Sun May 05 2013", "amount": 12000},
            { "id": 1, "created_at": "Mon May 13 2013", "amount": 2000},
            { "id": 2, "created_at": "Thu Jun 06 2013", "amount": 17000},
            { "id": 4, "created_at": "Thu May 09 2013", "amount": 15000},
            { "id": 5, "created_at": "Mon Jul 01 2013", "amount": 16000}
        ];
        var data = JSONData.slice();
        refreshGraph();
        var svgsrc = window.document.innerHTML;
        res.end(svgsrc);
        // append the svg to the container selector
    }});
});

if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}

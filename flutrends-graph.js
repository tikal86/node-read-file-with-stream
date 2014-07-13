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
// http://mango-is.com/blog/engineering/pre-render-d3-js-charts-at-server-side.html
    // return stream from flutable
    flutable.html(req, res);
//    console.log(res);
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>';
    // pass the html stub to jsDom
    jsdom.env({ features : { QuerySelector : true }, html : htmlStub, done : function (errors, window) {
        // process the html document, like if we were at client side
        // code to generate the dataviz and process the resulting html file to be added here
        var el = window.document.querySelector('#dataviz-container'), body = window.document.querySelector('body');

        // append the svg to the container selector
        d3.select(el)
            .append('svg:svg')
                .attr('width', 600).attr('height', 300)
                .append('circle')
                    .attr('cx', 300).attr('cy', 150).attr('r', 30).attr('fill', '#26963c');

            // save result in an html file
            var svgsrc = window.document.innerHTML;
            res.end(svgsrc);
        }
    });
});

if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}

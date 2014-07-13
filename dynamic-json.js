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
    var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><button class=".add-data"/><script src="js/d3.v3.min.js"></script></body></html>';
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
        var format = d3.time.format("%a %b %d %Y");
        var amountFn = function (d) { return d.amount; };
        var dateFn = function (d) { return format.parse(d.created_at); };

        var x = d3.time.scale()
            .range([60, 630])
            .domain(d3.extent(data, dateFn));

        var y = d3.scale.linear()
            .range([180, 10])
            .domain(d3.extent(data, amountFn));

        var svg = d3.select(el).append("svg:svg")
            .attr("width", 650)
            .attr("height", 200);

        var refreshGraph = function () {
            svg.selectAll("circle").data(data).enter()
                .append("svg:circle")
                .attr("r", 4)
                .attr("cx", function (d) { return x(dateFn(d)); })
                .attr("cy", function (d) { return y(amountFn(d)); });
        };

        d3.selectAll(".add-data")
            .on("click", function () {
                var start = d3.min(data, dateFn);
                var end = d3.max(data, dateFn);
                var time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
                var date = new Date(time);
                var obj = {
                    'id': Math.floor(Math.random() * 70),
                    'amount': Math.floor(1000 + Math.random() * 20001),
                    'created_at': date.toDateString()
                };
                data.push(obj);
                refreshGraph();
            });
        var svgsrc = window.document.innerHTML;
        res.end(svgsrc);
        // append the svg to the container selector
    }});
});

if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}

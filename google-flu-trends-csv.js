/*jslint node: true es5:true nomen: true*/
"use strict";

var request = require("request");
var fs = require("fs");
var csv = require("csv-streamify");
var es = require("event-stream");
var Handlebars = require("handlebars");

var tmpl = Handlebars.compile("<tr><td>{{Date}}</td><td align=\"center\">{{[United States]}}</td><td>{{Alabama}}</td></tr>");

//Data format:
//Datum,Verenigde Staten,Alabama,Alaska,Arizona,Arkansas,Californië,Colorado,Connecticut,Delaware,Washington D.C.,Florida,Georgia,Hawaï,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming,"HHS Region 1 (CT, ME, MA, NH, RI, VT)","HHS Region 2 (NJ, NY)","HHS Region 3 (DE, DC, MD, PA, VA, WV)","HHS Region 4 (AL, FL, GA, KY, MS, NC, SC, TN)","HHS Region 5 (IL, IN, MI, MN, OH, WI)","HHS Region 6 (AR, LA, NM, OK, TX)","HHS Region 7 (IA, KS, MO, NE)","HHS Region 8 (CO, MT, ND, SD, UT, WY)","HHS Region 9 (AZ, CA, HI, NV)","HHS Region 10 (AK, ID, OR, WA)","Anchorage, AK","Birmingham, AL","Little Rock, AR","Mesa, AZ","Phoenix, AZ","Scottsdale, AZ","Tempe, AZ","Tucson, AZ","Berkeley, CA","Fresno, CA","Irvine, CA","Los Angeles, CA","Oakland, CA","Sacramento, CA","San Diego, CA","San Francisco, CA","San Jose, CA","Santa Clara, CA","Sunnyvale, CA","Colorado Springs, CO","Denver, CO","Washington, DC","Gainesville, FL","Hialeah, FL","Jacksonville, FL","Miami, FL","Orlando, FL","Tampa, FL","Atlanta, GA","Roswell, GA","Honolulu, HI","Des Moines, IA","Boise, ID","Chicago, IL","Indianapolis, IN","Wichita, KS","Lexington, KY","Baton Rouge, LA","New Orleans, LA","Boston, MA","Somerville, MA","Baltimore, MD","Grand Rapids, MI","Saint Paul, MN","Kansas City, MO","Springfield, MO","Saint Louis, MO","Jackson, MS","Cary, NC","Charlotte, NC","Durham, NC","Greensboro, NC","Raleigh, NC","Lincoln, NE","Omaha, NE","Newark, NJ","Albuquerque, NM","Las Vegas, NV","Reno, NV","Albany, NY","Buffalo, NY","New York, NY","Rochester, NY","Cincinnati, OH","Cleveland, OH","Columbus, OH","Dayton, OH","Oklahoma City, OK","Tulsa, OK","Beaverton, OR","Eugene, OR","Portland, OR","Philadelphia, PA","Pittsburgh, PA","State College, PA","Providence, RI","Columbia, SC","Greenville, SC","Knoxville, TN","Memphis, TN","Nashville, TN","Austin, TX","Dallas, TX","Fort Worth, TX","Houston, TX","Irving, TX","Lubbock, TX","Plano, TX","San Antonio, TX","Salt Lake City, UT","Arlington, VA","Norfolk, VA","Reston, VA","Richmond, VA","Bellevue, WA","Seattle, WA","Spokane, WA","Madison, WI","Milwaukee, WI"
// HTTP GET Request
request("http://www.google.org/flutrends/us/data.txt")
    .pipe(es.split("\n"))
    // Split Strings into Array
    .pipe(es.mapSync(function (data) {
        if (data.length > 160) {
            return data;
        }
    }))
    // Join Strings
    .pipe(es.join("\n"))
    // Concat Strings
    .pipe(es.wait())
    // Parse CSV as Object
    .pipe(csv({objectMode: true, columns: true, delimiter: ',', newline: '\n'}))
    // Convert Array w/ Sprintf
    .pipe(es.mapSync(tmpl))
    // Join Strings
    .pipe(es.join("\n"))
    // Concat Strings
    .pipe(es.wait())
    // Wrap Strings
    .pipe(es.mapSync(function (data) {
        return "<table><tr><th>Datum</th><th>Verenigde Staten</th><th>Alabama</th></tr>\n" + data + "\n</table>";
    }))
    // Write File
    .pipe(fs.createWriteStream("output/flutable.html"));

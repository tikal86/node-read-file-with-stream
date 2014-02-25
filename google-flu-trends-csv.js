/*jslint node: true es5:true nomen: true*/
"use strict";

var request = require("request"),
    fs = require("fs"),
    csv = require("csv-streamify"),
    es = require("event-stream"),
    Transform = require('stream').Transform;

var keys;

var headerParser = new Transform({objectMode: true});
headerParser.header = null;
headerParser._transform = function (data, encoding, done) {
    if (!this.header) {
        keys = Object.keys(data);
        if (keys[0] === 'Datum') {
            this.header = keys;
        }
    }
    this.push(data);
    done();
}

//Data format:
//Datum,Verenigde Staten,Alabama,Alaska,Arizona,Arkansas,Californië,Colorado,Connecticut,Delaware,Washington D.C.,Florida,Georgia,Hawaï,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming,"HHS Region 1 (CT, ME, MA, NH, RI, VT)","HHS Region 2 (NJ, NY)","HHS Region 3 (DE, DC, MD, PA, VA, WV)","HHS Region 4 (AL, FL, GA, KY, MS, NC, SC, TN)","HHS Region 5 (IL, IN, MI, MN, OH, WI)","HHS Region 6 (AR, LA, NM, OK, TX)","HHS Region 7 (IA, KS, MO, NE)","HHS Region 8 (CO, MT, ND, SD, UT, WY)","HHS Region 9 (AZ, CA, HI, NV)","HHS Region 10 (AK, ID, OR, WA)","Anchorage, AK","Birmingham, AL","Little Rock, AR","Mesa, AZ","Phoenix, AZ","Scottsdale, AZ","Tempe, AZ","Tucson, AZ","Berkeley, CA","Fresno, CA","Irvine, CA","Los Angeles, CA","Oakland, CA","Sacramento, CA","San Diego, CA","San Francisco, CA","San Jose, CA","Santa Clara, CA","Sunnyvale, CA","Colorado Springs, CO","Denver, CO","Washington, DC","Gainesville, FL","Hialeah, FL","Jacksonville, FL","Miami, FL","Orlando, FL","Tampa, FL","Atlanta, GA","Roswell, GA","Honolulu, HI","Des Moines, IA","Boise, ID","Chicago, IL","Indianapolis, IN","Wichita, KS","Lexington, KY","Baton Rouge, LA","New Orleans, LA","Boston, MA","Somerville, MA","Baltimore, MD","Grand Rapids, MI","Saint Paul, MN","Kansas City, MO","Springfield, MO","Saint Louis, MO","Jackson, MS","Cary, NC","Charlotte, NC","Durham, NC","Greensboro, NC","Raleigh, NC","Lincoln, NE","Omaha, NE","Newark, NJ","Albuquerque, NM","Las Vegas, NV","Reno, NV","Albany, NY","Buffalo, NY","New York, NY","Rochester, NY","Cincinnati, OH","Cleveland, OH","Columbus, OH","Dayton, OH","Oklahoma City, OK","Tulsa, OK","Beaverton, OR","Eugene, OR","Portland, OR","Philadelphia, PA","Pittsburgh, PA","State College, PA","Providence, RI","Columbia, SC","Greenville, SC","Knoxville, TN","Memphis, TN","Nashville, TN","Austin, TX","Dallas, TX","Fort Worth, TX","Houston, TX","Irving, TX","Lubbock, TX","Plano, TX","San Antonio, TX","Salt Lake City, UT","Arlington, VA","Norfolk, VA","Reston, VA","Richmond, VA","Bellevue, WA","Seattle, WA","Spokane, WA","Madison, WI","Milwaukee, WI"
// HTTP GET Request
request("http://www.google.org/flutrends/us/data.txt")
// Read File
//fs.createReadStream("input/google-flutrends.csv")
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
    // get header
    .pipe(headerParser)
//    .pipe(process.stdout)
    // put values in table row
    .pipe(es.mapSync(function (data) {
        var row = "<tr>";
        for (var i=0; i < keys.length; i++) {
            row += "<td>" + data[keys[i]] + "</td>";
        }
        row += "</tr>";
        return row;
    }))
    // Join Strings
    .pipe(es.join("\n"))
    // Concat Strings
    .pipe(es.wait())
    // Wrap Strings
    .pipe(es.mapSync(function (data) {
        var tabel = "<html><head><style>td {text-align: center;} th {background: #ccc;width: 100%;min-width:200px}</style></head><body><table><tr>";
        for (var i=0; i < keys.length; i++) {
            tabel = tabel + "<th>" + keys[i]  + "</th>";
        }
        tabel = tabel + "</tr>\n" + data + "\n</table></body></html>";
        return tabel;
    }))
    // Write File
    .pipe(fs.createWriteStream("output/flutable.html"))
    .on('finish', function() {
        console.log('Einde');
    })
    ;

exports.html = function (req, res) {
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
                console.log('in add data');
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
}

// this initial prototype is from https://github.com/sureshlodha/Thota_California_Projects_2015/blob/master/MotionChart/index.html
d3

var data = [{
    "country": "United States of America",
        "region": "North America",
        "population": [
        [2000,312],
        [2001,315],
        [2002,318],
        [2003,321],
        [2004,324],
        [2005,327],
        [2006,300],
        [2007,303],
        [2008,306],
        [2009,309],
        [2010,312]
        
    ],
        "ecc": [
        [2000,327],
        [2001,328],
        [2002,332],
        [2003,336],
        [2004,342],
        [2005,346],
        [2006,333],
        [2007,336],
        [2008,326],	
        [2009,308],
        [2010,316]
        
    ],
        "gdp": [
        [2000,9.2],
        [2001,9.8],
        [2002,10.3],
        [2003,10.9],
        [2004,11.4],
        [2005,12.2],
        [2006,13.8],
        [2007,14.4],
        [2008,14.7],
        [2009,14.4],
        [2010,14.9]
      
    ]
}, {
    "country": "China",
        "region": "Aisa",
        "population": [
        [2000,1062],
        [2001,1143],
        [2002,1196],
        [2003,1224],
        [2004,1284],
        [2005,1298],
        [2006,1326],
        [2007,1334],
        [2008,1342],
        [2009,1351],
        [2010,1359] 
    ],
        "ecc": [
        [2000,25],
        [2001,36],
        [2002,32],
        [2003,38],
        [2004,44],
        [2005,51],
        [2006,56],
        [2007,60],
        [2008,64],
        [2009,71],
        [2010,75]

        
    ],
        "gdp": [
        [2000,1.23],
        [2001,1.59],
        [2002,1.42],
        [2003,1.74],
        [2004,1.97],
        [2005,2.42],
        [2006,2.71],
        [2007,3.49],
        [2008,4.52],
        [2009,4.99],
        [2010,5.93]
    ]
},{
    "country": "Imperium of Chad",
        "region": "Europe",
        "population": [
        [2000,80],
        [2001,82],
        [2002,74],
        [2003,86],
        [2004,92],
        [2005,95],
        [2006,100],
        [2007,102],
        [2008,152],
        [2009,220],
        [2010,284]
        
    ],
        "ecc": [
        [2000,154],
        [2001,167],
        [2002,164],
        [2003,172],
        [2004,189],
        [2005,212],
        [2006,233],
        [2007,301],
        [2008,354],	
        [2009,368],
        [2010,384]
        
    ],
        "gdp": [
        [2000,9.2],
        [2001,10.5],
        [2002,10.7],
        [2003,11.2],
        [2004,11.8],
        [2005,12.4],
        [2006,12.8],
        [2007,13.2],
        [2008,13.7],
        [2009,14.2],
        [2010,14.7]
      
    ]
}];

// Define Margin
var margin = { top: 20, right: 20, bottom: 20, left: 40 },
    width = 1200 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var xMax = 15
var yMax = 400

// Define X-Y Scale
var xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

// Define X-Y Axis

var xAxis = d3.axisBottom(xScale);//d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.axisLeft(yScale);//d3.svg.axis().scale(yScale).orient("left");

// Define  Color
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Define SVG
var svg = d3.select("body").append("svg")
    .attr("width", 1400 + margin.left + margin.right)
    .attr("height", 500 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
// Add X-Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add Y-Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add X-Axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 960)
    .attr("y", height - 6)
    .text("GDP");

// Add Y-Axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Literacy");

// Adding in boxes for buttons later
    var recH = 15;
    var recW = 78;
//Adds a rectangle
svg.append("rect")
    .attr("x", width+35)
    .attr("y", 10)
    .attr("width", recW)
    .attr("height", recH)
    .style("opacity", .8)
    .attr("fill", "lightblue");
svg.append("text")
    .attr("class","text")
    .style("text-anchor", "start")
    .attr("x", width+40)
    .attr("y", 20)
    .style("fill", "black")
    .text("Literacy Rate");

svg.append("rect")
    .attr("x", width+35)
    .attr("y", 30)
    .attr("width", recW)
    .attr("height", recH)
    .style("opacity", .8)
    .attr("fill", "lightgrey");
svg.append("text")
    .attr("class","text")
    .style("text-anchor", "start")
    .attr("x", width+40)
    .attr("y", 40)
    .style("fill", "black")
    .text("Child Mortality");

svg.append("rect")
    .attr("x", width+35)
    .attr("y", 50)
    .attr("width", recW)
    .attr("height", recH)
    .style("opacity", .8)
    .attr("fill", "lightgrey");
svg.append("text")
    .attr("class","text")
    .style("text-anchor", "start")
    .attr("x", width+40)
    .attr("y", 60)
    .style("fill", "black")
    .text("Malaria Deaths");

svg.append("rect")
    .attr("x", width+35)
    .attr("y", 70)
    .attr("width", recW)
    .attr("height", recH)
    .style("opacity", .8)
    .attr("fill", "lightgrey");
svg.append("text")
    .attr("class","text")
    .style("text-anchor", "start")
    .attr("x", width+40)
    .attr("y", 80)
    .style("fill", "black")
    .text("Starvation Rate");

// Year Transition Label 
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 24)
    .attr("x", width)
    .text(2000);

var country = svg.append("text")
    .attr("class", "country")
    .attr("y", height - margin.bottom)
    .attr("x", margin.left)
    .text("");

// Load Data.

var buckets = {};
d3.csv("cross-country-literacy-rates.csv").then(function(d) {
    console.log(d);
    d.forEach((country) => {
        console.log(country);
    })
});
draw(data);

function draw(nations) {

    // Bisector - See API Reference > Core > Arrays. Look for d3.bisector
    var bisect = d3.bisector(function (d) {
        return d[0];
    }); 

    // Tooltip
    
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
    // Define Dot(circle to represet data)
    var dot = svg.selectAll(".dot")
        .data(interpolateData(2000))
        .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function (d) {
        return color(d.region);
    })
        
        .on("mouseover", function (d) {
        tooltip.html("<strong>Country:</strong> " + d.country + "<br><strong>Population:</strong> " + d.population.toLocaleString() + " million" + "<br><strong>Energy Consumption per Capita:</strong> " + d.ecc + "<br><strong>GDP:</strong> " + d.gdp);
        tooltip.attr('class', 'd3-tip');
        return tooltip.style("visibility", "visible");
    })
        .on("mousemove", function (d) {
        tooltip.html("<strong>Country:</strong> " + d.country + "<br><strong>Population:</strong> " + d.population.toLocaleString() + " million" + "<br><strong>Energy Consumption per Capita:</strong> " + d.ecc + "<br><strong>GDP:</strong> " + d.gdp);
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
    })
        .on("mouseout", function (d) {
        return tooltip.style("visibility", "hidden");
    });
      
    var box = label.node().getBBox();
    console.log(box)
    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height);
         
    svg.transition()
        .duration(2000)
        .tween("year", tweenYear)
        //.each("end", enableInteraction);
    
    function position(dot) {
        dot.attr("cx", function (d) { return xScale(d.gdp); })
            .attr("cy", function (d) { return yScale(d.ecc); })
            .attr("r", 20)
    }
    
    function order(a, b) {
        return b.population - a.population;
    }
    
    function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([2006, 2010])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);
        
        overlay.on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
            label.classed("active", true);
        }

        function mouseout() {
            label.classed("active", false);
        }

        function mousemove() {
            displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
    }

    function tweenYear() {
        var year = d3.interpolateNumber(2000, 2010);
        return function (t) {
            displayYear(year(t));
        };
    }

    function displayYear(year) {
        dot.data(interpolateData(year), function(d) { return d.country; }).call(position).sort(order);
        label.text(Math.round(year));
    }

    function interpolateData(year) {
        return nations.map(function (d) {
            return {
                country: d.country,
                region: d.region,
                population: interpolateValues(d.population, year),
                ecc: interpolateValues(d.ecc, year),
                gdp: interpolateValues(d.gdp, year)
            };
        });
    }
    
    function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
            var b = values[i - 1],
                t = (year - a[0]) / (b[0] - a[0]);
            return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
    }
}
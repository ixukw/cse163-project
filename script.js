// this initial prototype is based off https://github.com/sureshlodha/Thota_California_Projects_2015/blob/master/MotionChart/index.html

var start_year = 1950;
var end_year = 2015;

// Y-Axis values
var goal_str = ["", "Extreme Poverty Rate", "Literacy Rate (%)", "Gender Wage Gap", "Child Mortality/Year", "Maternal health",
               "Deaths from Malaria", "Environmental Sustainability", "Global Partnership"]
var goal_num = 2

// Define Margin
var margin = { top: 20, right: 20, bottom: 20, left: 64},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var maxGDP = 50000,
    maxYScale = 104;

// Define X-Y Scale
var xScale = d3.scaleLinear().domain([0, maxGDP]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, maxYScale]).range([height, 0]);

// Define X-Y Axis

var xAxis = d3.axisBottom(xScale);//d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.axisLeft(yScale);//d3.svg.axis().scale(yScale).orient("left");

// Define  Color
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Add buttons
var buttons = ['Goal 1: Eradicate Extreme Poverty and Hunger','Goal 2: Achieve Universal Primary Education','Goal 3: Promote Gender Equality and Empower Women','Goal 4: Reduce Child Mortality','Goal 5: Improve Maternal Health','Goal 6: Combat HIV/AIDS, Malaria, and Other Diseases','Goal 7: Ensure Environmental Sustainability','Goal 8: Global Partnership for Development'];

window.onload = function() {
    var buttondiv = document.getElementById("buttons")
    buttons.forEach(function (b,i) {
        var ele = document.createElement('button')
        ele.innerHTML = b;
        ele.id = i+1;
        ele.addEventListener('click',changeGoal)
        buttondiv.appendChild(ele);
    });
    
    function changeGoal(event) {
        d3.select("div.svg").selectAll("*").remove();
        selection = event.currentTarget.id;
        goal_num = event.currentTarget.id;
        drawSVG(event.currentTarget.id);
    }
}

// search function by text box
var searchCode = "ALL"
var selection = "2"
function search(){
    searchCode = document.getElementById("searchBox").value;
    if(searchCode == ""){
        searchCode = "ALL";
    }
    console.log(searchCode)
    
    // draw
    console.log(selection)
    d3.select("div.svg").selectAll("*").remove();
    drawSVG(selection);
}

// Parse data
var data = [];

Promise.all([
    d3.csv('gdp-per-capita-maddison-2020.csv'),
    d3.csv('population-since-1800.csv'),
    d3.csv('cross-country-literacy-rates.csv'),
    d3.csv('child-deaths-igme-data.csv'),
    d3.csv('malaria-death-rates.csv'),
    d3.csv('continents-according-to-our-world-in-data.csv')
]).then(function(files) {
    var index;
    files.forEach((csv,i) => {
        csv.forEach(function (d) {
            // get the name of the stat for this csv
            var stat = Object.keys(d)[3];
            // get the index of the country in the data
            index = data.findIndex(x => x.country == d.Entity);

            // if country not in data, push country to data
            if (index == -1 && i==0) {
                data.push({
                    'country': d.Entity,
                    'region': d.Code
                });
                index = data.findIndex(x => x.country == d.Entity);
            }

            if (index != -1) {
                // if stat not in data.country, create stat array
                if (!data[index].hasOwnProperty(stat)) {
                    data[index][stat] = [];
                }
                data[index][stat].push([d.Year,d[stat]]);
            }
        });
    });

    // remove some incomplete entries
    data.forEach(function (d, i) {
        if (!('population' in d)) {
            data.splice(i, 1);
        }
    });

    console.log(data);
    drawSVG(2);
});

function drawSVG(goal_to_draw) {
    // Define SVG
    var svg = d3.select("div.svg").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
        .attr("x", width)
        .attr("y", height - 6)
        .text("GDP");

    // Add Y-Axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("y", -3)
        .style("font", "24px times")
        .text("Goal: " + goal_str[goal_num]);
    
    //add legends
    svg.append("circle").attr("cx",750).attr("cy",150).attr("r", 6).style("fill", d3.schemeCategory10[0])
    svg.append("circle").attr("cx",750).attr("cy",180).attr("r", 6).style("fill", d3.schemeCategory10[1])
    svg.append("circle").attr("cx",750).attr("cy",210).attr("r", 6).style("fill", d3.schemeCategory10[2])
    svg.append("circle").attr("cx",750).attr("cy",240).attr("r", 6).style("fill", d3.schemeCategory10[3])
    svg.append("circle").attr("cx",750).attr("cy",270).attr("r", 6).style("fill", d3.schemeCategory10[4])
    svg.append("circle").attr("cx",750).attr("cy",300).attr("r", 6).style("fill", d3.schemeCategory10[5])
svg.append("text").attr("x", 770).attr("y", 150).text("Asia").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 770).attr("y", 180).text("Europe").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 770).attr("y", 210).text("Africa").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 770).attr("y", 240).text("South America").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 770).attr("y", 270).text("Australia").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 770).attr("y", 300).text("North America").style("font-size", "15px").attr("alignment-baseline","middle")

    
    
    // Year Transition Label 
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 24)
        .attr("x", width)
        .text(start_year);

    var country = svg.append("text")
        .attr("class", "country")
        .attr("y", height - margin.bottom)
        .attr("x", margin.left)
        .text("");
    
    draw(data, goal_to_draw);
    
    // Functions to update X,Y Axis
    function updateX(newVal){
        maxGDP = newVal;
        xScale = d3.scaleLinear().domain([0, maxGDP]).range([0, width]);
        xAxis = d3.axisBottom(xScale);
        svg.select(".x.axis").call(xAxis);
    }
    function updateY(newVal){
        maxYScale = newVal;
        yScale = d3.scaleLinear().domain([0, maxYScale]).range([height, 0]);
        yAxis = d3.axisLeft(yScale);
        svg.select(".y.axis").call(yAxis);
    }

    function draw(nations, goal_id) {
        // choose right stat from the goal
        var stat_names = ['','literacy_rate','Gender_Pay_Gap','deaths_under_five','','malaria_deaths\year','',''];
        var stat = stat_names[goal_id-1];
        // Bisector - See API Reference > Core > Arrays. Look for d3.bisector
        var bisect = d3.bisector(function (d) {
            return d[0];
        }); 
        
        // Resets scale
        updateX(50000);
        updateY(104);
        
        // Tooltip

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden");

        // Define Dot(circle to represet data)
        var dot = svg.selectAll(".dot")
            .data(interpolateData(start_year))
            .enter().append("circle")
            .attr("class", "dot")
            .style("opacity", function(d){
                if(searchCode == d.country){
                    return 1;
                }
                else if(searchCode == "ALL"){
                    return 1;
                }
                else{
                    return 0.1;
                }
            })
            .style("fill", function (d) {
                return color(d.region);
            })

            .on("mouseover", function (d) {
                tooltip.html(`<strong>Country:</strong> ${d.country}<br><strong>Population:</strong> ${d.population.toLocaleString()}<br><strong>${stat}:</strong> ${d[stat]}<br><strong>GDP:</strong> ${d.gdp}`);
                tooltip.attr('class', 'd3-tip');
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function (d) {
                tooltip.html(`<strong>Country:</strong> ${d.country}<br><strong>Population:</strong> ${d.population.toLocaleString()}<br><strong>${stat}:</strong> ${d[stat]}`);
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function (d) {
                return tooltip.style("visibility", "hidden");
            });

        var box = label.node().getBBox();
        var overlay = svg.append("rect")
            .attr("class", "overlay")
            .attr("x", box.x)
            .attr("y", box.y)
            .attr("width", box.width)
            .attr("height", box.height);

        svg.transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .tween("year", tweenYear)
            //.each("end", enableInteraction);

        function position(dot) {
            dot.attr("cx", function (d) { return xScale(d.gdp); })
                .attr("cy", function (d) { return yScale(d[stat]); })
                .attr("r", function (d) { 
                    if (d[stat] > maxYScale){
                        updateY(d[stat]);
                    }
                    if (d.gdp > maxGDP){
                        updateX(d.gdp);
                    }
                    var ans = 0;
                    if(d.population > 300000000){
                        ans = Math.log2(d.population);
                        if(d.population > 600000000){
                            ans += 15;
                        }
                    } else if (d.population > 100000000){
                        ans = Math.log(d.population);
                    } else if (d.population > 70000000){
                        ans = Math.log(d.population)/Math.log(3);
                    } else if (d.population > 30000000){
                        ans = Math.log(d.population)/Math.log(5);
                    } else {
                        ans = Math.log10(d.population);
                    }
                    return ans })
                }

        function order(a, b) {
            return b.population - a.population;
        }
        /*
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
        }*/

        function tweenYear() {
            var year = d3.interpolateNumber(start_year, end_year);
            return function (t) {
                //console.log(year(t))
                displayYear(year(t));
            };
        }

        function displayYear(year) {
            //console.log(interpolateData(year))
            dot.data(interpolateData(year), function(d) { return d.country; }).call(position).sort(order);
            label.text(Math.round(year));
        }

        function interpolateData(year) {
            return nations.map(function (d) {
                return {
                    country: d.country,
                    region: d.Continent,
                    population: d.population ? interpolateValues(d.population, year) : 0,
                    literacy_rate: d.literacy_rate ? interpolateValues(d.literacy_rate, year) : 0,
                    malaria_deaths: d.malaria_deaths ? interpolateValues(d.malaria_deaths, year) : 0,
                    deaths_under_five: d.deaths_under_five ? interpolateValues(d.deaths_under_five, year) : 0,
                    gdp: interpolateValues(d.gdp, year),
                    
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
}

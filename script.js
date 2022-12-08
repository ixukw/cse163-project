// this initial prototype is based off https://github.com/sureshlodha/Thota_California_Projects_2015/blob/master/MotionChart/index.html

var start_year = 1950;
var end_year = 2015;

var curr_year = start_year;
var curr_max = 0;

// Y-Axis values
var goal_str = ["", 
                "Share of Population living on $30 a day",
                "Literacy Rate (%)",
                "Wage Gap Between Men Earning and Women (%)",
                "Child Mortality Per Year",
                "Maternal Deaths Per Year",
                "Deaths from Malaria Per Year",
                "CO2 Emissions (Mil. Tons)",
                "Imports and Exports as % of GDP"]
var goal_desc = ["",
                 "Goal: Decrease the number of people living in poverty",
                 "Goal: Increase the Litearcy Rate",
                 "Goal: Decrease that Gap between Men and Women",
                 "Goal: Reduce Child Mortality",
                 "Goal: Decrease Maternal Deaths",
                 "Goal: Decrease Malaria Deaths",
                 "Goal: Reduce C02 Emissions",
                 "Goal: Increase Trade between Nations",
]
var goal_num = 2
var region_selected = 'ALL';

// Define svg for later
var svg;

// Define Margin
var margin = { top: 20, right: 20, bottom: 45, left: 74},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var maxGDP = 50000,
    maxYScale = 104;

// Define X-Y Scale
var xScale = d3.scaleLinear().domain([0, maxGDP]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, maxYScale]).range([height, 0]);

// Define X-Y Axis

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

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
        svg.interrupt();
        d3.select("div.svg").selectAll("*").remove();
        selection = event.currentTarget.id;
        goal_num = event.currentTarget.id;
        drawSVG(event.currentTarget.id);
    }
    
    var regionSelect = document.getElementById("regionselect");
    regionSelect.addEventListener('change', function(ele) {
        console.log(ele);
        region_selected = regionSelect.value;
        svg.interrupt();
        d3.select("div.svg").selectAll("*").remove();
        drawSVG(selection);
    });
}

// search function by text box
var searchCode = "ALL";
var selection = "2";

function search(country){
    searchCode = country;//document.getElementById("searchBox").value;
    console.log(searchCode)
    
    // draw
    console.log(selection)
    svg.interrupt();
    d3.select("div.svg").selectAll("*").remove();
    drawSVG(selection);
}

var selectedRegions = [];

// Parse data
var data = [];

Promise.all([
    d3.csv('gdp-per-capita-maddison-2020.csv'),
    d3.csv('population-since-1800.csv'),
    d3.csv('cross-country-literacy-rates.csv'),
    d3.csv('child-deaths-igme-data.csv'),
    d3.csv('malaria-death-rates.csv'),
    d3.csv('continents-according-to-our-world-in-data.csv'),
    d3.csv('number-of-maternal-deaths.csv'),
    d3.csv('poverty-share-on-less-than-30-per-day-2011-ppp.csv'),
    d3.csv('annual-co2-emissions-per-country.csv'),
    d3.csv('trade-openness.csv'),
    d3.csv('share-deaths-aids.csv'),
    d3.csv('gender-wage-gap-oecd.csv')
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
    
    d3.select("#countrysearch").selectAll("options").data(data).enter()
        .append("option")
        .text(function (d) { return d.country; })
        .attr("value", function (d) { return d.country; })
    d3.select("#countrysearch").on("change", function (d) {
        search(d3.select(this).property("value"));
    })
    drawSVG(2);
});

function drawSVG(goal_to_draw) {
    // Define SVG
    svg = d3.select("div.svg").append("svg")
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
        .text("GDP per capita (int. $)");

    // Add Y-Axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("y", -3)
        .style("font", "24px times")
        .text(goal_str[goal_num]);
    // Add Goal Label
    svg.append("text")
        .attr("class", "goal label")
        .attr("x", 0)
        .attr("y", height + 40)
        .style("font", "24px times")
        .text(goal_desc[goal_num]);
    
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
    svg.append("text").attr("x", 770).attr("y", 270).text("Oceania").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 770).attr("y", 300).text("North America").style("font-size", "15px").attr("alignment-baseline","middle")

    
    
    // Year Transition Label 
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 24)
        .attr("x", width)
        .text(start_year);

    /*var country = svg.append("text")
        .attr("class", "country")
        .attr("y", height - margin.bottom)
        .attr("x", margin.left)
        .text("");*/
    
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
        var stat_names = ['below_poverty_line','literacy_rate','gender_wage_gap','deaths_under_five','maternal_deaths','malaria_deaths','annual_co2_emissions','trade_openness'];
        var stat = stat_names[goal_id-1];
        
        // Bisector - See API Reference > Core > Arrays. Look for d3.bisector
        var bisect = d3.bisector(function (d) {
            return d[0];
        }); 
        
        // Resets x and y scales
        updateX(50000);
        updateY(104);
        curr_max = 0;
        
        // Define Tooltip
        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden");

        // Define Dot (circle to represent data)
        var dot = svg.selectAll(".dot")
            .data(interpolateData(start_year))
            .enter().append("circle")
            .attr("class", "dot")
            .style("opacity", function(d){
                if (region_selected != "ALL") {
                    if (d.region[0][1] == region_selected) {
                        return 1;
                    } else if (searchCode == "ALL") {
                        return 0.1;
                    }
                }
                if(searchCode == d.country){
                    return 1;
                }
                else if(searchCode == "ALL"){
                    return 1;
                }
                else {
                    return 0.1;
                }
            })
            .style("fill", function (d) {
                return color(d.region);
            })

            .on("mouseover", function (d) {
                if (region_selected != "ALL") {
                    if (d.region[0][1] != region_selected && searchCode != d.country) {
                        return tooltip.style("visibility", "hidden");
                    }
                }
                tooltip.html(`<strong><p>${d.country}</p></strong>
                            <strong>Population:</strong> ${d.population.toLocaleString()}<br>
                            <strong>${goal_str[goal_id]}:</strong> ${parseFloat(d[stat]).toLocaleString(undefined, {maximumFractionDigits:2})}<br>
                            <strong>GDP per Capita:</strong> ${d.gdp.toLocaleString()}`);
                tooltip.attr('class', 'd3-tip');
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function (d) {
                if (region_selected != "ALL") {
                    if (d.region[0][1] != region_selected && searchCode != d.country) {
                        return tooltip.style("visibility", "hidden");
                    }
                }
                tooltip.html(`<strong><p>${d.country}</p></strong>
                            <strong>Population:</strong> ${d.population.toLocaleString()}<br>
                            <strong>${goal_str[goal_id]}:</strong> ${parseFloat(d[stat]).toLocaleString(undefined, {maximumFractionDigits:2})}<br>
                            <strong>GDP per Capita:</strong> ${d.gdp.toLocaleString()}`);
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
            .duration(15000)
            .ease(d3.easeLinear)
            .tween("year", tweenYear)
            //.on("end", enableInteraction);

        function position(dot) {
            dot.attr("cx", function (d) { return xScale(d.gdp); })
                .attr("cy", function (d) { return yScale(d[stat]); })
                .attr("r", function (d) { 
                    if (d[stat] > maxYScale){
                        updateY(d[stat]);
                    }
                    if(d[stat] > curr_max){
                        curr_max = d[stat];
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
                    return ans;
            })
        }

        function order(a, b) {
            return b.population - a.population;
        }
        
        /*function enableInteraction() {
            var yearScale = d3.scaleLinear()
                .domain([start_year, end_year])
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
                displayYear(year(t));
            };
        }

        function displayYear(year) {
            dot.data(interpolateData(year), function(d) { return d.country; }).call(position).sort(order);
            label.text(Math.round(year));
        }

        // Interpolate the missing data for smooth transition
        function interpolateData(year) {
            return nations.map(function (d) {
                return {
                    country: d.country,
                    region: d.Continent,
                    population: d.population ? interpolateValues(d.population, year) : 0,
                    literacy_rate: d.literacy_rate ? interpolateValues(d.literacy_rate, year) : -9999,
                    malaria_deaths: d.malaria_deaths ? interpolateValues(d.malaria_deaths, year) : -9999,
                    deaths_under_five: d.deaths_under_five ? interpolateValues(d.deaths_under_five, year) : -9999,
                    maternal_deaths: d.maternal_deaths ? interpolateValues(d.maternal_deaths, year) : -9999,
                    below_poverty_line: d.below_poverty_line ? interpolateValues(d.below_poverty_line, year) : -9999,
                    gender_wage_gap: d.gender_wage_gap ? interpolateValues(d.gender_wage_gap, year) : -9999,
                    trade_openness: d.trade_openness ? interpolateValues(d.trade_openness, year) : -9999,
                    annual_co2_emissions: d.annual_co2_emissions ? interpolateValues(d.annual_co2_emissions, year) : -9999,
                    hiv_aids_deaths: d.hiv_aids_deaths ? interpolateValues(d.hiv_aids_deaths, year) : -9999,
                    gender_wage_gap: d.gender_wage_gap ? interpolateValues(d.gender_wage_gap, year) : -9999,
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

(function() {
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const populationNumber = (x) => {
        let stringNumber = numberWithCommas(x);

        //Supposing numbers are in million scale
        let parts = stringNumber.split(",");
        let partsSize = parts.length;
        let finalString = Number(parts[0] + "." + parts[1]).toFixed(2).toString();

        if (partsSize === 3) finalString += " million";
        if (partsSize === 4) finalString += " billion";

        return finalString;
    }

    function drawBarChart(data) {
        var svg = d3.select("svg");
        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 100
        };
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand().padding(0.1);
        var y = d3.scaleLinear();

        x.domain(data.map(function (d) {
            return d.country;
        }));
        y.domain([0, d3.max(data, function (d) {
              return Number(d.population);
        })]);

        var tooltip = d3.select("body")
          .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("font-weight", "bold")
            .style("font-size", "16px");

        //X Axis
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("font-weight", "bold")
          .append("text")
            .attr("fill", "#000")
            .attr("y", 8)
            .attr("dy", "7")
            .attr("text-anchor", "end")
            .text("Country");

        //Y Axis
        g.append("g")
            .attr("class", "axis axis--y")
            .attr("font-weight", "bold")
          .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "7")
            .attr("text-anchor", "end")
            .text("Population");


            function draw() {
                var chartRect = svg.node().getBoundingClientRect();
                var width  = chartRect.width - margin.left - margin.right;
                var height = chartRect.height - margin.top - margin.bottom;

                x.rangeRound([0, width]);
                y.rangeRound([height, 0]);

                g.select(".axis--x")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x));

                g.select(".axis--x text")
                    .attr("x", width);

                g.select(".axis--y")
                  .call(d3.axisLeft(y));

                g.selectAll(".bar")
                    .data(data)
                    .attr("x", function (d) {
                        return x(d.country);
                    })
                    .attr("y", function (d) {
                        return y(Number(d.population));
                    })
                    .attr("width", x.bandwidth())
                    .attr("height", function (d) {
                        return height - y(Number(d.population));
                    })
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d) {
                        return x(d.country);
                    })
                    .attr("y", function (d) {
                        return y(Number(d.population));
                    })
                    .attr("width", x.bandwidth())
                    .attr("height", function (d) {
                        return height - y(Number(d.population));
                    })
                    .on("mouseover", function(d) {
                        return tooltip.style("visibility", "visible").text(populationNumber(Number(d.population)));
                    })
                    .on("mousemove", function() {
                        return tooltip.style("top", (event.pageY-15)+"px").style("left",(event.pageX+15)+"px");
                    })
                    .on("mouseout", function() {
                        return tooltip.style("visibility", "hidden");
                    });
          }
          draw();

          window.addEventListener("resize", draw);
    }

    var brazilPopulationAPI = "http://api.population.io/1.0/population/Brazil/today-and-tomorrow/?format=json";
    var usaPopulationAPI    = "http://api.population.io/1.0/population/United%20States/today-and-tomorrow/?format=json";
    var francePopulationAPI = "http://api.population.io/1.0/population/France/today-and-tomorrow/?format=json";
    var japanPopulationAPI  = "http://api.population.io/1.0/population/Japan/today-and-tomorrow/?format=json";
    var italyPopulationAPI  = "http://api.population.io/1.0/population/Italy/today-and-tomorrow/?format=json";

    $.when(
        $.getJSON(brazilPopulationAPI),
        $.getJSON(usaPopulationAPI),
        $.getJSON(francePopulationAPI),
        $.getJSON(japanPopulationAPI),
        $.getJSON(italyPopulationAPI)
    ).done(function(brazilData, usaData, franceData, japanData, italyData) {
        var brazilPopulation = brazilData[0].total_population[0].population;
        var usaPopulation    = usaData[0].total_population[0].population;
        var francePopulation = franceData[0].total_population[0].population;
        var japanPopulation  = japanData[0].total_population[0].population;
        var italyPopulation  = italyData[0].total_population[0].population;

        console.log("Brazil Population: ", brazilPopulation);
        console.log("USA Population: ",    usaPopulation);
        console.log("France Population: ", francePopulation);
        console.log("Japan Population: ",  japanPopulation);
        console.log("Italy Population: ",  italyPopulation);

        var data=[{"country":"Brazil",        "population":brazilPopulation},
                  {"country":"United States", "population":usaPopulation},
                  {"country":"France",        "population":francePopulation},
                  {"country":"Japan",         "population":japanPopulation},
                  {"country":"Italy",         "population":italyPopulation}];

        //Drawing the Bar Chart
        drawBarChart(data);
    });
})();

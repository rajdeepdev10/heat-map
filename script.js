fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
.then(response => response.json())
.then(data => {

    drawChart(data);
    
});


function drawChart(data){
    const svgWidth = 800;
    const svgHeight = 500;
    const padding = 100;

    const baseTemperature = data.baseTemperature;
    const variance_data = data.monthlyVariance;

    const tooltip = d3.select("#tooltip");

    const months = [
        "January",
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    //define svg inside svg variable
    const svg = d3.select("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);

    // create x-axis scale
    const xAxisScale = d3.scaleTime()
                            .domain([d3.min(variance_data, item => item.year), d3.max(variance_data, item => item.year)])
                            .range([padding, svgWidth - padding]);

    // create y-axis scale
    const yAxisScale = d3.scaleLinear()
                            .domain([1, 12]) 
                            .range([padding, svgHeight - padding]);




    const xAxis = d3.axisBottom(xAxisScale)
                    .tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yAxisScale)
                    .tickFormat(month => {
                        const date = new Date(0);
                        date.setUTCMonth(month);
                        return d3.timeFormat('%B')(date);   // <---?  
                    });

    const num_years = variance_data[variance_data.length - 1].year - variance_data[0].year; //lastYear - firstYear
    
    // appending x and y axis
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${svgHeight - padding})`);

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, -${((svgHeight - 2*padding) / 12) / 2})`);  // translate y axis by 'rectHeight'/2


    // appending rect
    svg.selectAll("rect")
        .data(variance_data)
        .enter()
        .append('rect')
        .attr("class", "cell")
        .attr("fill", item => {
            if (item.variance <= -1){
                return "deepskyblue";
            } else if (item.variance <= 0){
                return "lightblue"
            }else if (item.variance <= 1){
                return "yellow"
            }else{
                return "gold"
            }
        })
        .attr("data-month", item => item.month - 1)
        .attr("data-year", item => item.year)
        .attr("data-temp", item => item.variance + baseTemperature)
        .attr("height", (svgHeight - 2*padding) / 12)
        .attr("width", (svgWidth - 2*padding) / num_years)
        .attr("y", item => yAxisScale(item.month - 1))
        .attr("x", item => xAxisScale(item.year) + 1)
        .on("mouseover", (event, item) => {
            tooltip.transition()
                .duration(200)
                .style("visibility", "visible")
                .style("opacity", 0.9);

            tooltip.html(`
                ${months[item.month - 1]}, ${item.year}<br>
                T: ${(item.variance + baseTemperature).toFixed(2)} &#186;C<br>
                &sigma;&sup2;: ${item.variance.toFixed(2)} &#186;C
            `)

            tooltip.style("left", (event.pageX + 10)  + 'px')
                    .style("top", (event.pageY + 10) + 'px');

            tooltip.attr("data-year", item.year);
                
        })
        .on("mouseout", () => {
            tooltip.transition()
                    .duration(500)
                    .style("visibility", "hidden");
        });

    



    // create the legend

    const colors = ['deepskyblue', 'lightblue', 'yellow', 'gold'];

    const textPadding = 20;

    const legendWidth = 150;
    const legendHeight = 150 / colors.length + textPadding;
    
    const legendRectWidth = legendWidth / colors.length;
    const legendRectHeight = legendHeight - textPadding;

    const legend = d3.select("body")
                        .append("svg")
                        .attr("width", legendWidth)
                        .attr("height", legendHeight)
                        .attr("id", "legend");

    // appending 'rect'
    legend.selectAll("rect")
            .data(colors)
            .enter()
            .append("rect")
            .attr("x", (d, i) => legendRectWidth * i)
            .attr("y", 0)
            .attr("width", legendRectWidth)
            .attr("height", legendRectHeight)
            .attr("fill", c => c);

    // appending legendAxis
    const legendAxisScale = d3.scaleLinear()
                                .domain([-2, 2]) 
                                .range([0, legendWidth - legendRectWidth]);

    const legendAxis = d3.axisBottom(legendAxisScale)
                            .tickFormat(x => {
                                if (x == -2)
                                {
                                    return `<${x}`
                                }
                                else if (x == 2)
                                {
                                    return `>${x}`
                                }
                                else return x;
                            })
                            .ticks(3);

    legend.append("g")
            .call(legendAxis)
            .attr("id", "legend-axis")
            .attr("transform", `translate(${legendRectWidth / 2}, ${legendHeight - textPadding})`);
    


}
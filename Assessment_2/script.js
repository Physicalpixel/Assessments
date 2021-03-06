let width = 1400,
    height = 800;

let svg = d3.select("#container")
let svg1 = d3.select("#container1")

let body = d3.select("body")

svg1.append("text")
    .attr("id", "container1")
    .attr("x", 700)
    .attr("y", 80)
    .text("Stock Tracker")
    .attr("fill", "#474747")
    .attr("font-size", "60px")
    .attr("font-weight", 900)


let promises = [
    d3.csv("https://raw.githubusercontent.com/Physicalpixel/Stock_Data/main/data_bind.csv")
]

Promise.all(promises).then(ready)

function ready([data]) {


    let Ticker = d3.map(data, d => d.Symbol).keys()
    console.log(Ticker[0])
    var select = svg.append("foreignObject")
        .attr("x", 100)
        .attr("y", 35)
        .attr("width", 100)
        .attr("height", 100)
        .append("xhtml:body")
        .append("div")
        .append("select")
        .on("change", onchange)


    select
        .selectAll('myOptions')
        .data(Ticker)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        }) // text showed in the menu
        .attr("value", function(d) {
            return d;
        })


    let maxValue = d3.max(data, d => +d.Close)
    let minValue = d3.min(data, d => +d.Close)
    let yScale = d3.scaleLinear()
        .range([height - 180, 60])
        .domain([minValue - 10, maxValue]);
    let y = svg.append("g")
        .attr("transform", "translate(" + (width - 100) + " ,0)")
        .call(d3.axisRight(yScale));

    let xScale = d3.scaleTime()
        .range([70, width - 100])
        .domain(d3.extent(data, d => new Date(d.Date)));
    let x = svg.append("g")
        .attr("transform", "translate(0," + (620) + ")")
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%b-%y"))
            .ticks(11))

    let Valueline = d3.line()
        .x(function(d) {
            return xScale(new Date(d.Date));
        })
        .y(function(d) {
            return yScale(+d.Close);
        })
        .curve(d3.curveBasis)

    let line = svg.append("path")
        .datum(data.filter(function(d) {
            return d.Symbol == "ABB"
        }))
        .attr("d", Valueline)
        .attr("class", "line")


    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('display', 'block')
        .style("position", "absolute")
        .style('visibility', 'hidden')
        .style('width', 100)
        .style('height', 100)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    let circ = svg.append("g")
        .selectAll("circles")
        .data(data.filter(function(d) {
            return d.Symbol == "ABB"
        }))
        .enter()
        .append("circle")
        .attr("cx", d => xScale(new Date(d.Date)))
        .attr("cy", d => yScale(+d.Close))
        .attr("r", 3)
        .on("mouseover", (d) => {
            d3.select(".mouse-line")
                .style("opacity", "1");

            tooltip.transition()
                .style("visibility", "visible")
            tooltip.html("Open:" + d.Open + "---" + "High:" + d.High + "---" + "Low:" + d.Low + "---" + "Close:" + d.Close)
        })
        .on("mousemove", function() {
            let mouse = d3.mouse(this);

            // move the vertical line
            d3.select(".mouse-line")
                .attr("d", function() {
                    let d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });
            return tooltip.style("top", (event.pageY - 2) + "px").style("left", (event.pageX - 2) + "px");
        })
        .on("mouseout", (item) => {
            d3.select(".mouse-line")
                .style("opacity", "0");
            tooltip.transition()
                .style("visibility", "hidden")
        })
        .style("opacity", 0.2)
        .style("fill", "red")


    function update(selectedGroup) {

        // Create new data with the selection?
        let dataFilter = data.filter(function(d) {
            return d.Symbol == selectedGroup
        })

        xScale = d3.scaleTime()
            .range([70, width - 100])
            .domain(d3.extent(dataFilter, d => new Date(d.Date)));
        x.transition().duration(100).call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%b-%y")))
        let maxValue1 = d3.max(dataFilter, d => +d.Close)
        let minValue1 = d3.min(dataFilter, d => +d.Close)
        yScale = d3.scaleLinear()
            .range([height - 180, 100])
            .domain([minValue1 - 10, maxValue1]);
        y.transition().duration(100).call(d3.axisRight(yScale));

        line
            .datum(dataFilter)
            .transition()
            .duration(100)
            .attr("d", d3.line()
                .x(function(d) {
                    return xScale(new Date(d.Date))
                })
                .y(function(d) {
                    return yScale(+d.Close)
                })
            )

        circ
            .data(dataFilter)
            .attr("cx", d => xScale(new Date(d.Date)))
            .attr("cy", d => yScale(+d.Close))
            .transition()
            .duration(100)
    }

    function onchange() {
        var select = d3.select(this)
        var Value = select.property('value')
        update(Value)
    };

}

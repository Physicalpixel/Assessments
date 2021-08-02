let canvas = d3.select("svg")
var click_xpos;
var click_ypos;
var cx;
var cy;
var data_input = {};
var data_list = [];

var columns = ["X-Position", "Y-Position", "Description"]
canvas.append("rect")
    .attr("x", 900)
    .attr("y", 125)
    .attr("width", 300)
    .attr("height", 125)
    .attr("fill", "#474747")

canvas.append("text")
    .text("File Attributes")
    .attr("x", 919)
    .attr("y", 150)
    .attr("fill", "white")
    .style("font-size", "22px")

canvas.append("text")
    .text("File-name:")
    .attr("x", 919)
    .attr("y", 180)
    .attr("fill", "white")
canvas.append("text")
    .text("MIME Type:")
    .attr("x", 919)
    .attr("y", 205)
    .attr("fill", "white")
canvas.append("text")
    .text("Dimension:")
    .attr("x", 919)
    .attr("y", 230)
    .attr("fill", "white")

var table = d3.select("#container")
    .append("foreignObject")
    .attr("width", 700)
    .attr("height", 500)
    .attr("x", 900)
    .attr("y", 350)
    .append("xhtml:table");
var thead = table.append("thead")
var tbody = table.append("tbody")

thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(d, i) {
        return d;
    })
    .style("fill", "#474747")

function readURL(input) {

    var image_url = URL.createObjectURL(input.files[0]).toString()
    var fileUpload = document.getElementById("file");
    var reader = new FileReader();
    reader.readAsDataURL(fileUpload.files[0]);
    reader.onload = function(e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function() {
            image_dimen_h = this.height;
            image_dimen_w = this.width;
            console.log(image_dimen_h, image_dimen_w)
            canvas.append("text")
                .text("Dimension:" + " " + image_dimen_w + " x " + image_dimen_h)
                .attr("x", 919)
                .attr("y", 230)
                .attr("fill", "white")
        }
    }

    canvas.append("rect")
        .attr("x", 900)
        .attr("y", 125)
        .attr("width", 300)
        .attr("height", 125)
        .attr("fill", "#474747")

    canvas.append("text")
        .text("File Attributes")
        .attr("x", 919)
        .attr("y", 150)
        .attr("fill", "white")
        .style("font-size", "20px")

    canvas.append("text")
        .text("File-name:" + " " + input.files[0].name)
        .attr("x", 919)
        .attr("y", 180)
        .attr("fill", "white")
    canvas.append("text")
        .text("MIME Type:" + " " + input.files[0].type)
        .attr("x", 919)
        .attr("y", 205)
        .attr("fill", "white")


    var image = canvas.append("image")
        .attr("xlink:href", function() {
            return image_url
        })
        .attr("x", 50)
        .attr("y", 190)
        .attr("width", 600)
        .attr("height", 650)
        .style("opacity", 1)
    image
        .on('click', function(d) {
            click_xpos = event.pageX
            click_ypos = event.pageY

            console.log(click_xpos, click_ypos)
                //console.log(document.getElementById("test").style.top)
            document.getElementById("test").style.top = click_ypos + "px"
            document.getElementById("test").style.left = click_xpos + "px"
            document.getElementById("input1").value = "";

            var T = document.getElementById("test")
            return T.style.display = "block";
        })

    canvas.append("text")
        .text("Click on the image to enter description")
        .attr("x", 160)
        .attr("y", 160)
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "#E8175D")

}

let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style("position", "absolute")
    .style('visibility', 'hidden')
    .style('width', 100)
    .style('height', 100)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

function showInput() {
    var T = document.getElementById("test")
    T.style.display = "none";

    value = document.getElementById("input1").value
    if (value == "") {
        return;
    }

    var circ = canvas.append("circle")
        .attr("cx", click_xpos)
        .attr("cy", click_ypos)
        .attr("r", 7)
        .attr("fill", "FireBrick")
        .attr("user_text", value)
        .on("mouseover",
            function(ev) {
                tooltip.transition()
                    .style("visibility", "visible")
                if (value == "") {
                    tooltip.text("no description entered")
                } else {
                    tooltip.text(value)
                }
                cx = d3.event.target.cx.animVal.value
                cy = d3.event.target.cy.animVal.value
                console.log("cx_cy:", cx, cy, data_input[cx + "_" + cy])

            })
        .on("mousemove", function() {
            return tooltip.style("top", (event.pageY - 2) + "px").style("left", (event.pageX - 2) + "px");
        })
        .on("mouseout", (item) => {
            tooltip.transition()
                .style("visibility", "hidden")
        })


    var key = click_xpos + "_" + click_ypos
    data_input[key] = value

    data_list.push({
        "X-Position": click_xpos,
        "Y-Position": click_ypos,
        "Description": value
    });

    console.log(data_list)
    var rows = tbody.selectAll('tr')
        .data(data_list)
        .enter()
        .append('tr');

    var cells = rows.selectAll('td')
        .data(function(row) {
            // console.log(data_list)
            return columns.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                };
            });
        })
        .enter()
        .append('td')
        .style("fill", "white")
        .text(function(d) {
            // console.log(d.value)
            return d.value;
        });

}

function cancelInput() {
    var T = document.getElementById("test")
    return T.style.display = "none";
}

canvas.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", 100)
    .attr("width", 1920)
    //.style("opacity", 0.2)
    .style("fill", "#474747")

canvas.append("text")
    .text("Image Mapper")
    .attr("x", 720)
    .attr("y", 70)
    .style("font-size", "60px")
    .style("font-weight", "bold")
    .style("fill", "white")


canvas.append("text")
    .text("Attributes List")
    .attr("x", 900)
    .attr("y", 320)
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("fill", "#474747")
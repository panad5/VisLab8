d3.csv("driving.csv", d3.autoType).then(data=>{
    console.log(data);

let outerWidth = 600;
let outerHeight = 500;
let margin = {top:40, right:40, bottom: 40, left: 40}; //create margin between axis and outside of chart
let width = outerWidth - margin.left - margin.right, height = outerHeight - margin.top - margin.bottom;
let svg = d3.select('.chart-area').append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.miles)).nice()
    .range([0, width])

yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.gas)).nice()
    .range([height, 0])

    const line = d3
    .line()
    .x(d => xScale(d.miles))
    .y(d => yScale(d.gas))

    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

let dollarFormat = function(d) { return '$' + d3.format('.2f')(d) };

let xAxis = d3.axisBottom().ticks(6).scale(xScale);
let yAxis = d3.axisLeft().ticks(8).scale(yScale).tickFormat(dollarFormat);

let xaxis = svg.append("g") //container for axis
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`)   //translates axis to bottom

let yaxis = svg.append("g")
.attr("class", "axis y-axis")
.call(yAxis)

xaxis.select(".domain").remove()
yaxis.select(".domain").remove()
    
var xAxisGrid = xAxis.ticks(6)
    .tickSize(height, 0)
    .tickFormat("")

    svg.append("g")
    .classed('x', true)
    .classed('grid', true)
    .call(xAxisGrid)
    .attr("x2", width)
    .attr("stroke-opacity", 0.1)

yaxis.selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1) // make it transparent 

xLabel = svg.append("text")
    .attr("class", "xaxis")
    .attr('x', width-150)
    .attr('y', height -5)
    .attr("font-size", "13")
    .text("Miles per person per year")
    .call(halo)

    yLabel = svg.append("text")
    .attr("class", "yaxis")
    .attr('x', 0)
    .attr('y', -5)
    .attr("font-size", "13")
    .text("Cost per gallon")
    .call(halo)  

svg.selectAll('circles')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d=>xScale(d.miles))
    .attr('cy', d=>yScale(d.gas))
    .attr('r', 3)
    .attr('stroke', "black")
    .attr('fill', 'white')

    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
          case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
          case "right":
            t.attr("dx", "0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "start");
            break;
          case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
          case "left":
            t.attr("dx", "-0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "end");
            break;
        }
      }

function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }

svg.selectAll('text.labels')
.data(data)
.enter()
.append('text')
.text(function(d){
    let year = d.year
    return year
})
.attr('x',d=>xScale(d.miles))
.attr('y', d=> yScale(d.gas))
.attr("font-size", "11")
.attr("fill", "black")
.each(position)
.call(halo);
});
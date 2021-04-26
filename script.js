let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest()

let data
let value

let heightScale
let xScale
let xAxisScale
let yAzisScale

let width = 800;
let height= 600;
let padding = 40;

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {

    heightScale = d3.scaleLinear()
    .domain([0,d3.max(value, (item) => {
        return item[1]
    })])
    .range([0, height - (2*padding)])

    xScale = d3.scaleLinear()
    .domain([0, value.length -1])
    .range([padding, width - padding])

    let datasArray = value.map((item)=>{
        return new Date(item[0])
    }) 

console.log(datasArray)

    xAxisScale = d3.scaleTime()
    .domain([d3.min(datasArray), d3.max(datasArray)])
    .range([padding, width-padding])

    yAzisScale = d3.scaleLinear()
    .domain([0, d3.max(value, (item) => {
        return item[1]
    })])
    .range([height - padding, padding])
}

let drawBars = () => {
    let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('width', 'auto')
    .style('heigth', 'auto')

    svg.selectAll('rect')
    .data(value)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', (width  - (2 *padding)) /value.length)
    .attr('data-date', (item) =>{
        return item[0]
    } )
    .attr('data-gdp', (item) => {
        return item[1]
    })
    .attr('height', (item) => {
        return heightScale(item[1])
    })
    .attr('x', (item, index) => {
        return xScale(index)
    })
    .attr('y', (item) => {
        return (height - padding) - heightScale(item[1])
    })
    
    .on('mouseover', (item) => {
        tooltip.transition()
        .style('visibility', 'visible')
        tooltip.text(item[0])

        document.querySelector('#tooltip').setAttribute('data-date', item[0])
    })
    .on('mouseout',(item) => {
        tooltip.transition()
        .style('visibility', 'hidden')
    })
}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAzisScale)

    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (height-padding) + ')' )

    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ',0)')
    
}

req.open('GET', url, true)
req.onload = () => {

    data = JSON.parse(req.responseText)
    value = data.data
    console.log(value)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()

}
req.send()
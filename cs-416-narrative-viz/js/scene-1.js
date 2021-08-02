function renderScene1() {

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 70, bottom: 100, left: 90 },
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;
  tooltip = { width: 100, height: 100, x: 10, y: -30 };

  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");
  var formatTime = d3.timeFormat("%d");
  var tooltipFormatTime = d3.timeFormat("%Y-%m-%d");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);
  var valueLine = d3.line()
    .x(function (d) { return x(d.RecordDate); })
    .y(function (d) { return y(d.ActiveCaseCount); });

  var x1 = d3.scaleTime().range([0, width]);
  var y1 = d3.scaleLinear().range([height, 0]);
  var valueLine1 = d3.line()
    .x(function (d) { return x1(d.RecordDate); })
    .y(function (d) { return y1(d.PercentChange); });

  var scene1 = d3.select("svg#scene-1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var yValues = [1009976, 3645164, -2.504512144736555983];

  // Get the data
  d3.json("data/covid-19-active.json").then(function (data) {

    d3.csv("data/nifty_50_overall.csv").then(function (data1) {

      data.forEach(function (d) {
        d.RecordDate = parseTime(d.RecordDate);
        d.ActiveCaseCount = +d.ActiveCaseCount;
      });

      data1.forEach(function (d) {
        d.RecordDate = parseTime(d.RecordDate);
        d.PercentChange = +d.PercentChange;
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function (d) { return d.RecordDate; }));
      y.domain([0, d3.max(data, function (d) { return d.ActiveCaseCount; })]);
      x1.domain(d3.extent(data1, function (d) { return d.RecordDate; }));
      y1.domain(d3.extent(data1, function (d) { return d.PercentChange; }));

      // Add the x Axis
      scene1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
          .ticks(d3.timeDay.filter(d => d3.timeDay.count(0, d) % 30 === 0))
          .tickFormat(d3.timeFormat("%b %Y")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      scene1.append("text")
        .attr("transform",
          "translate(" + (width / 2) + " ," +
          (height + margin.top + 50) + ")")
        .style("text-anchor", "middle")
        .text("Month");

      scene1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Active Cases of COVID-19");


      // Add the ActiveCaseCount Y Axis
      scene1.append("g")
        .attr("class", "axisRed")
        .call(d3.axisLeft(y));

      scene1.append("line")
        .attr(
          {
            "class": "horizontalGrid",
            "x1": 0,
            "x2": width,
            "y1": y(0),
            "y2": y(0),
            "fill": "none",
            "shape-rendering": "crispEdges",
            "stroke": "black",
            "stroke-width": "1px",
            "stroke-dasharray": ("3, 3")
          });
      var animationData = [];
      animationData[0] = {
        name: 'ActiveCaseCount',
        data: data,
        fn: valueLine,
        stroke: "red"
      }
      animationData[1] = {
        name: 'PercentComplete',
        data: data1,
        fn: valueLine1,
        stroke: "#69b3a2"
      }

      scene1
        .selectAll(".plot-axis")
        .data(animationData)
        .enter().append("g")
        .attr("class", "plot-axis");

      var path = scene1
        .selectAll(".plot-axis").append("path")
        .attr("class", "line")
        .attr("d", function (d) { return d.fn(d.data); });

      var totalLength = [
        path._groups[0][0].getTotalLength(),
        path._groups[0][1].getTotalLength()
      ];

      d3.select(path._groups[0][0])
        .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0])
        .attr("stroke-dashoffset", totalLength[0])
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .style("stroke", animationData[0].stroke)
        .attr("stroke-dashoffset", 0);


      d3.select(path._groups[0][1])
        .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1])
        .attr("stroke-dashoffset", totalLength[1])
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .style("stroke", animationData[1].stroke)
        .attr("stroke-dashoffset", 0);

      // Add the PercentChange Y1 Axis
      scene1.append("g")
        .attr("class", "axisGreen")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(y1));

      scene1
        .append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y1).tickSize(-width).tickFormat(""));

      scene1.append("text")
        .attr("transform", "rotate(270)")
        .attr("y", width + (margin.right / 2))
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Nifty-50 Index Percent Change");

      var pcTooltip = d3.select("#div-scene1-pc-tooltip")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
      var pcMouseover = function (event, d) {
        pcTooltip.style("opacity", 1)
      }

      var pcMousemove = function (event, d) {
        pcTooltip
          .html("Percent Change on " + tooltipFormatTime(d.RecordDate) + " is " + d.PercentChange)
          .style("left", (event.x) + 2 + "px")
          .style("top", (event.y) + 2 + "px")
      }

      var pcMouseleave = function (d) {
        pcTooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }
      scene1
        .append("g")
        .selectAll("dot")
        .data(animationData[1].data.filter(function (d, i) {
          var day = formatTime(d.RecordDate)
          return (day % 5 == 0)
        }))
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x1(d.RecordDate); })
        .attr("cy", function (d) { return y1(d.PercentChange); })
        .attr("r", "5")
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)
        .style("stroke", "white")
        .on("mouseover", pcMouseover)
        .on("mousemove", pcMousemove)
        .on("mouseleave", pcMouseleave);

      var acTooltip = d3.select("#div-scene1-ac-tooltip")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
      var acMouseover = function (event, d) {
        acTooltip.style("opacity", 1)
      }

      var acMousemove = function (event, d) {
        acTooltip
          .html(d.ActiveCaseCount + ": Active Cases on " + tooltipFormatTime(d.RecordDate))
          .style("left", (event.x) + 2 + "px")
          .style("top", (event.y) + 2 + "px")
      }

      var acMouseleave = function (d) {
        acTooltip.transition().duration(200).style("opacity", 0)
      }
      scene1
        .append("g")
        .selectAll("dot")
        .data(animationData[0].data.filter(function (d, i) {
          var day = formatTime(d.RecordDate)
          return (day % 5 == 0)
        }))
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.RecordDate); })
        .attr("cy", function (d) { return y(d.ActiveCaseCount); })
        .attr("r", "5")
        .style("fill", "red")
        .style("opacity", 0.3)
        .style("stroke", "white")
        .on("mouseover", acMouseover)
        .on("mousemove", acMousemove)
        .on("mouseleave", acMouseleave);


      var scene1Annotations = [
        {
          note: {
            bgPadding: 10,
            label: "Due to shutdown announced in US, UK and other major countries",
            title: "Highly Volatile"
          },
          x: x1(parseTime("2020-03-17")),
          y: y1(yValues[2]),
          dx: 47,
          dy: 40
        },
        {
          note: {
            bgPadding: 10,
            label: "After lifting the country-wide shutdown",
            title: "First Wave"
          },
          x: x(parseTime("2020-09-17")),
          y: y(yValues[0]),
          dx: -47,
          dy: 20
        },
        {
          note: {
            bgPadding: 10,
            label: "Due to the effect of mutants / variants",
            title: "Second Wave"
          },
          x: x(parseTime("2021-05-07")),
          y: y(yValues[1]),
          dx: -47,
          dy: 40
        }
      ]

      const makeAnnotations = d3.annotation().annotations(scene1Annotations);
      scene1.append("g").call(makeAnnotations);
    });
  });
}
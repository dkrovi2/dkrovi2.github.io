var scene0Annotations = []

function renderScene0() {
  var margin = { top: 120, right: 20, bottom: 180, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.2);
  var y = d3.scaleLinear().range([height, 0]);

  var dy = function(d) {
    if (d.Industry === "METALS") {
      return -80
    }
    return -40
  }

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("svg#scene-0")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  d3.json("data/symbols-by-industry-nifty-top-50.json").then(function (data) {
    // format the data
    data.forEach(function (d) {
      d.SymbolsCount = +d.Symbols.length;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) { return d.Industry; }));
    y.domain([0, d3.max(data, function (d) { return d.SymbolsCount; })]);

    data.forEach(function (d) {
      const annotation = {
        note: {
          bgPadding: 10,
          label: d.Symbols.join(",  "),
          title: d.Industry
        },
        x: x(d.Industry),
        y: y(d.SymbolsCount),
        dx: 07,
        dy: dy(d)
      };
      scene0Annotations.push(annotation)
    });

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("fill", "#69b3a2")
      .attr("x", function (d) { return x(d.Industry); })
      //.attr("width", x.bandwidth())
      .attr("width", Math.min(x.bandwidth() - 2, 100))
      .attr("y", function (d) { return y(0); })
      .attr("height", function (d) { return height - y(0); })
      .on("mouseover", function (d) { d3.select(this).attr("fill", "red"); })
      .on("mouseout", function (d) { d3.select(this).attr("fill", "#69b3a2"); });

    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("y", function (d) { return y(d.SymbolsCount); })
      .attr("height", function (d) { return height - y(d.SymbolsCount); })
      .delay(function (d, i) { return (i * 100) })

    const makeAnnotations = d3.annotation().annotations(scene0Annotations);
    svg.append("g").call(makeAnnotations);
  });
}


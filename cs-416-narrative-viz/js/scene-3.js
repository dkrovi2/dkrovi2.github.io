async function renderScene3() {
  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 200, bottom: 100, left: 90 },
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");
  var svg = d3.select("#scene-3")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  const keys = ["AUTOMOBILE", "CEMENT_CEMENT_PRODUCTS", "CONSTRUCTION",
    "CONSUMER_GOODS", "FERTILISERS_PESTICIDES", "FINANCIAL_SERVICES",
    "INFOTECH", "MEDIA_ENTERTAINMENT_PUBLICATION", "METALS",
    "OIL_GAS", "PHARMA", "POWER",
    "SERVICES", "TELECOM"]

  const industry_to_key_map = {
    "AUTOMOBILE": "AUTOMOBILE",
    "CEMENT & CEMENT PRODUCTS": "CEMENT_CEMENT_PRODUCTS",
    "CONSTRUCTION": "CONSTRUCTION",
    "CONSUMER GOODS": "CONSUMER_GOODS",
    "FERTILISERS & PESTICIDES": "FERTILISERS_PESTICIDES",
    "FINANCIAL SERVICES": "FINANCIAL_SERVICES",
    "IT": "INFOTECH",
    "MEDIA ENTERTAINMENT & PUBLICATION": "MEDIA_ENTERTAINMENT_PUBLICATION",
    "METALS": "METALS",
    "OIL & GAS": "OIL_GAS",
    "PHARMA": "PHARMA",
    "POWER": "POWER",
    "SERVICES": "SERVICES",
    "TELECOM": "TELECOM"
  }

  var csvFile = "data/nifty_50_industry_perf.csv"
  d3.csv(csvFile).then(function (data) {
    data.forEach(function (d) {
      d.RecordDate = parseTime(d.RecordDate);
      // d.DayClose = Math.log(d.DayClose)
    });

    const sumstat = d3.group(data, d => d.Industry);
    const color =
      //d3.scaleOrdinal().domain(keys).range(d3.schemeSet3);
      d3
        .scaleOrdinal()
        .domain(keys)
        .range(["MediumSlateBlue", "DarkSlateBlue", "SlateBlue", "Indigo", "Purple", "DarkMagenta", "DarkOrchid",
          "DarkViolet", "BlueViolet", "RebeccaPurple", "MediumPurple", "Magenta", "MediumOrchid", "Orchid"])

    // Add X axis
    const x =
      d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.RecordDate; }))
        .range([0, width]);
    const xAxis =
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
          .ticks(d3.timeDay.filter(d => d3.timeDay.count(0, d) % 30 === 0))
          .tickFormat(d3.timeFormat("%b %Y")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Date");


    // Add Y axis
    const y =
      d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.DayClose; })])
        .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y).ticks(15))
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Price Movement");

    svg.selectAll(".line")
      .data(sumstat)
      .join("path")
      .attr("fill", "none")
      .attr("class", function (d) { return "myArea s3-" + industry_to_key_map[d[0]] })
      .attr("stroke", function (d) {
        return color(d[0]);
      })
      .attr("stroke-width", 2)
      .attr("d", function (d) {
        return d3.line()
          .x(function (d) { return x(d.RecordDate); })
          .y(function (d) { return y(+d.DayClose); })
          (d[1])
      })

    let idleTimeout
    function idled() { idleTimeout = null; }

    const highlight = function (event, d) {
      d3.selectAll(".myArea").style("opacity", .05)
      d3.select(".s3-" + d).style("opacity", 2)
    }

    const noHighlight = function (event, d) {
      d3.selectAll(".myArea").style("opacity", 2)
    }
    // Add one dot in the legend for each name.
    const size = 15
    const legendX = 690
    svg.selectAll("myrect")
      .data(keys)
      .join("rect")
      .attr("x", legendX)
      .attr("y", function (d, i) { return 10 + i * (size + 5) })
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) { return color(d) })
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .join("text")
      .attr("x", legendX + size * 1.2)
      .attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) })
      .style("fill", function (d) { return color(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("font-size", "50%")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)

  })
}
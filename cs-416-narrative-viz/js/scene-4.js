var industries = [
  {
    "Industry": "AUTOMOBILE",
    "Symbols": [
      "BAJAJ-AUTO",
      "EICHERMOT",
      "HEROMOTOCO",
      "M&M",
      "MARUTI",
      "TATAMOTORS"
    ]
  },
  {
    "Industry": "CEMENT & CEMENT PRODUCTS",
    "Symbols": [
      "GRASIM",
      "SHREECEM",
      "ULTRACEMCO"
    ]
  },
  {
    "Industry": "CONSTRUCTION",
    "Symbols": ["LT"]
  },
  {
    "Industry": "CONSUMER GOODS",
    "Symbols": [
      "ASIANPAINT",
      "BRITANNIA",
      "HINDUNILVR",
      "ITC",
      "NESTLEIND",
      "TITAN"
    ]
  },
  {
    "Industry": "FERTILISERS & PESTICIDES",
    "Symbols": ["UPL"]
  },
  {
    "Industry": "FINANCIAL SERVICES",
    "Symbols": [
      "AXISBANK",
      "BAJAJFINSV",
      "BAJFINANCE",
      "HDFC",
      "HDFCBANK",
      "ICICIBANK",
      "INDUSINDBK",
      "KOTAKBANK",
      "SBIN"
    ]
  },
  {
    "Industry": "IT",
    "Symbols": [
      "HCLTECH",
      "INFY",
      "TCS",
      "TECHM",
      "WIPRO"
    ]
  },
  {
    "Industry": "MEDIA ENTERTAINMENT & PUBLICATION",
    "Symbols": ["ZEEL"]
  },
  {
    "Industry": "METALS",
    "Symbols": [
      "COALINDIA",
      "HINDALCO",
      "JSWSTEEL",
      "TATASTEEL",
      "VEDL"
    ]
  },
  {
    "Industry": "OIL & GAS",
    "Symbols": [
      "BPCL",
      "GAIL",
      "IOC",
      "ONGC",
      "RELIANCE"
    ]
  },
  {
    "Industry": "PHARMA",
    "Symbols": [
      "CIPLA",
      "DRREDDY",
      "SUNPHARMA"
    ]
  },
  {
    "Industry": "POWER",
    "Symbols": ["NTPC", "POWERGRID"]
  },
  {
    "Industry": "SERVICES",
    "Symbols": ["ADANIPORTS"]
  },
  {
    "Industry": "TELECOM",
    "Symbols": ["BHARTIARTL"]
  }
]

function renderIndustries() {
  d3.selectAll("#industries > *").remove();
  var options = d3.select("#industries").selectAll("option")
    .data(industries)
    .enter()
    .append("option");
  options.text(function (d) { return d.Industry })
    .attr("value", function (d) { return d.Industry });

  d3.select("#industries").property("value", "AUTOMOBILE")
  renderSymbols(d3.select("#industries").property("value"))
  d3.select("#industries").on("change", function (d) {
    renderSymbols(d3.select("#industries").property("value"))
    updateGraph(d3.select("#industries").property("value"),
      d3.select("#symbols").property("value"))
  });
  d3.select("#symbols").on("change", function (d) {
    updateGraph(d3.select("#industries").property("value"),
      d3.select("#symbols").property("value"))
  });
}

function renderSymbols(industry) {
  var symbols;
  industries.forEach(function (d) {
    if (d.Industry === industry) {
      symbols = d.Symbols
    }
  });
  d3.selectAll("#symbols > *").remove();
  var options = d3.select("#symbols").selectAll("option")
    .data(symbols)
    .enter()
    .append("option");
  options.text(function (d) { return d })
    .attr("value", function (d) { return d });

  d3.select("#symbols").property("value", symbols[0])
}

function initScene4() {
  renderIndustries()
  updateGraph(d3.select("#industries").property("value"),
    d3.select("#symbols").property("value"))
}

function renderScene4() {
  updateGraph(d3.select("#industries").property("value"),
    d3.select("#symbols").property("value"))
}

function updateGraph(industry, symbol) {
  if (industry == null || industry === '' || symbol == null || symbol === '') {
    return
  }

  d3.selectAll("#scene-4 > *").remove();
  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 70, bottom: 100, left: 90 },
    width = 960 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;
  tooltip = { width: 100, height: 100, x: 10, y: -30 };

  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);
  var valueLine = d3.line()
    .x(function (d) { return x(d.RecordDate); })
    .y(function (d) { return y(d.VWAP); });


  var scene4 = d3.select("svg#scene-4")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("data/nifty_top_50_by_industry.csv").then(function (all_data) {
    var data = []
    all_data.forEach(function (d) {
      if (d.Industry === industry && d.Symbol === symbol) {
        data.push(d)
      }
    });

    data.forEach(function (d) {
      d.RecordDate = parseTime(d.RecordDate);
      d.VWAP = +d.VWAP;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.RecordDate; }));
    y.domain(d3.extent(data, function (d) { return d.VWAP; }));

    // Add the x Axis
    scene4.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .ticks(d3.timeDay.filter(d => d3.timeDay.count(0, d) % 30 === 0))
        .tickFormat(d3.timeFormat("%b %Y")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    scene4.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Month");

    scene4.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Volume Weighted Average Price (VWAP)");

    scene4.append("g")
      .attr("class", "axisGreen")
      .call(d3.axisLeft(y));

    scene4.append("line")
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
      name: 'VWAP',
      data: data,
      fn: valueLine,
      stroke: "#69b3a2"
    }

    scene4
      .selectAll(".plot-axis")
      .data(animationData)
      .enter().append("g")
      .attr("class", "plot-axis");

    var path = scene4
      .selectAll(".plot-axis").append("path")
      .attr("class", "line")
      .attr("d", function (d) {
        return d.fn(d.data);
      });

    var totalLength = [
      path._groups[0][0].getTotalLength()
    ];

    d3.select(path._groups[0][0])
      .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0])
      .attr("stroke-dashoffset", totalLength[0])
      .transition()
      .duration(3000)
      .ease(d3.easeLinear)
      .style("stroke", animationData[0].stroke)
      .attr("stroke-dashoffset", 0);

    var formatTime = d3.timeFormat("%d");
    var tooltipFormatTime = d3.timeFormat("%Y-%m-%d");

    var acTooltip = d3.select("#div-scene4-tooltip")
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
        .html("VWAP on " + tooltipFormatTime(d.RecordDate) + ": " + d.VWAP)
        .style("left", (event.x) + 2 + "px")
        .style("top", (event.y) + 2 + "px")
    }

    var acMouseleave = function (d) {
      acTooltip.transition().duration(200).style("opacity", 0)
    }
    scene4
      .append("g")
      .selectAll("dot")
      .data(animationData[0].data.filter(function (d, i) {
        var day = formatTime(d.RecordDate)
        return (day % 5 == 0)
      }))
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.RecordDate); })
      .attr("cy", function (d) { return y(d.VWAP); })
      .attr("r", "5")
      .style("fill", "red")
      .style("opacity", 0.3)
      .style("stroke", "white")
      .on("mouseover", acMouseover)
      .on("mousemove", acMousemove)
      .on("mouseleave", acMouseleave);

  });
}


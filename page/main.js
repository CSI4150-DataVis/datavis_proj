// Global variable
var marker = "";
var checker = null;
var geojson;
const regionList = [
  "홍대땡땡거리",
  "연희대우아파트앞",
  "연희초등학교",
  "연희동",
  "양원초등학교",
  "이대역 5번",
  "봉원사",
  "연세대학교",
  "이화여자대학교",
  "이화여대(이대역, 이대)",
  "경의중앙 신촌역",
  "신촌역(신촌역, 신촌로터리)",
  "경의선책거리",
  "홍대입구역(홍대)",
];

// Event handler functions
function getServiceValue(marker) {
  // get service list by using marker code
  var serviceArray = [];
  for (var item of markerArray) {
    if (item["상권_코드_명"] === marker) {
      var flag = false;
      for (var i = 0; i < serviceArray.length; i++) {
        if (serviceArray[i] === item["서비스_업종_코드_명"]) {
          flag = true;
        }
      }

      if (!flag) {
        serviceArray.push(item["서비스_업종_코드_명"]);
      }
    }
  }
  return serviceArray;
}

function getCheckboxValue(event) {
  const isChecked = event.target.checked;
  const value = event.target.value;

  if (isChecked) {
    if (value === "pop") {
      if (checker === "rev") {
        checker = "both";
      } else if (checker === "sankey") {
        checker = "pop_sankey";
      } else if (checker === "rev_sankey") {
        checker = "all";
      } else {
        checker = "pop";
      }
    } else if (value === "rev") {
      if (checker === "pop") {
        checker = "both";
      } else if (checker === "sankey") {
        checker = "rev_sankey";
      } else if (checker === "pop_sankey") {
        checker = "all";
      } else {
        checker = "rev";
      }
    } else if (value === "sankey") {
      if (checker === "pop") {
        checker = "pop_sankey";
      } else if (checker === "rev") {
        checker = "rev_sankey";
      } else if (checker === "both") {
        checker = "all";
      } else {
        checker = "sankey";
      }
    }
  } else {
    if (value === "pop") {
      if (checker === "both") {
        checker = "rev";
      } else if (checker === "pop_sankey") {
        checker = "sankey";
      } else if (checker === "all") {
        checker = "rev_sankey";
      } else {
        checker = null;
      }
    } else if (value === "rev") {
      if (checker === "both") {
        checker = "pop";
      } else if (checker === "rev_sankey") {
        checker = "sankey";
      } else if (checker === "all") {
        checker = "pop_sankey";
      } else {
        checker = null;
      }
    } else if (value === "sankey") {
      if (checker === "pop_sankey") {
        checker = "pop";
      } else if (checker === "rev_sankey") {
        checker = "rev";
      } else if (checker === "all") {
        checker = "both";
      } else {
        checker = null;
      }
    }
  }

  // Call the visualization function with the updated marker and checker values
  getVisualization(marker, checker);
}

function getMarkerValue(event) {
  if (
    event.target.innerHTML !== "연세대학교" &&
    event.target.innerHTML !== "이화여자대학교"
  ) {
    marker = event.target.innerHTML;
    serviceArray = getServiceValue(marker);
    console.log(marker);
    console.log(serviceArray);
    var divBox = document.getElementById("nameBox");
    var childChecker = divBox.querySelector("#name");
    if (childChecker) {
      divBox.removeChild(childChecker);
    }
    var newDiv = document.createElement("div");
    newDiv.id = "name";
    newDiv.innerHTML = marker;
    divBox.appendChild(newDiv);
    var serviceChecker = document.getElementById("select");
    if (serviceChecker) {
      divBox.removeChild(serviceChecker);
    }
    var select = makeSelectBox(serviceArray);
    divBox.appendChild(select);
  }
}

function makeSelectBox(items) {
  var container = document.getElementsByClassName("checkbox")[0];

  // Create a select element
  var select = document.createElement("select");
  select.id = "select";

  // Iterate through the list of items
  items.forEach(function (item) {
    // Create an option element
    var option = document.createElement("option");
    option.value = item;
    option.textContent = item;

    // Append the option element to the select element
    select.appendChild(option);
  });

  // Append the select element to the container
  //container.appendChild(select);
  return select;
}

// Visualization function
// time - population graph
function time_popVis(marker, checker) {
  // Extract the data from csv file
  d3.csv("./data/population_filtered.csv").then(function (data) {
    var pop_time_data = [];
    var target_year = "20234";
    var filteredData = data.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year && d["상권_코드_명"] === marker
    );

    pop_time_data[0] = {
      time: "00~06",
      value: parseInt(filteredData[0]["시간대_00_06_유동인구_수"]),
    };
    pop_time_data[1] = {
      time: "06~11",
      value: parseInt(filteredData[0]["시간대_06_11_유동인구_수"]),
    };
    pop_time_data[2] = {
      time: "11~14",
      value: parseInt(filteredData[0]["시간대_11_14_유동인구_수"]),
    };
    pop_time_data[3] = {
      time: "14~17",
      value: parseInt(filteredData[0]["시간대_14_17_유동인구_수"]),
    };
    pop_time_data[4] = {
      time: "17~21",
      value: parseInt(filteredData[0]["시간대_17_21_유동인구_수"]),
    };
    pop_time_data[5] = {
      time: "21~24",
      value: parseInt(filteredData[0]["시간대_21_24_유동인구_수"]),
    };

    // Define the dimensions and margins of the graph
    const width = 500;
    const height = 300;
    const marginTop = 30;
    const marginBottom = 30;
    const marginRight = 80;
    const marginLeft = 60;

    // Create an SVG element and append it to the DOM
    const svg = d3
      .select("#time-graph")
      .append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    // Define the x scale using the time data
    const x = d3
      .scalePoint()
      .domain(pop_time_data.map((d) => d.time))
      .range([0, width]);

    // Append the x axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Define the y scale using the pop values
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(pop_time_data, (d) => d.value)])
      .range([height, 0]);

    // Append the y axis to the SVG
    svg.append("g").call(d3.axisLeft(y));

    // Define the line generator for the pop data
    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.value))
      .curve(d3.curveBasis);

    // Append the pop line to the SVG with animation
    const path = svg
      .append("path")
      .datum(pop_time_data)
      .attr("class", "line-pop")
      .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Add a legend
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", 4)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#5785af");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", 11)
      .text("유동인구")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
  });
}

// time - revenue graph
function time_revVis(marker, checker) {
  d3.csv("./data/revenue_filtered.csv").then(function (data) {
    var target_year = "20234";
    var filteredData = data.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year &&
        d["상권_코드_명"] === marker &&
        d["서비스_업종_코드_명"] === document.getElementById("select").value
    );
    // Extract the data from csv file
    var rev_time_data = [];
    rev_time_data[0] = {
      time: "00~06",
      value: parseInt(filteredData[0]["시간대_00~06_매출_금액"]),
    };
    rev_time_data[1] = {
      time: "06~11",
      value: parseInt(filteredData[0]["시간대_06~11_매출_금액"]),
    };
    rev_time_data[2] = {
      time: "11~14",
      value: parseInt(filteredData[0]["시간대_11~14_매출_금액"]),
    };
    rev_time_data[3] = {
      time: "14~17",
      value: parseInt(filteredData[0]["시간대_14~17_매출_금액"]),
    };
    rev_time_data[4] = {
      time: "17~21",
      value: parseInt(filteredData[0]["시간대_17~21_매출_금액"]),
    };
    rev_time_data[5] = {
      time: "21~24",
      value: parseInt(filteredData[0]["시간대_21~24_매출_금액"]),
    };

    // Define the dimensions and margins of the graph
    const width = 500;
    const height = 300;
    const marginTop = 30;
    const marginBottom = 30;
    const marginRight = 80;
    const marginLeft = 60;

    // Create an SVG element and append it to the DOM
    const svg = d3
      .select("#time-graph")
      .append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    // Define the x scale using the time data
    const x = d3
      .scalePoint()
      .domain(rev_time_data.map((d) => d.time))
      .range([0, width]);

    // Append the x axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Define the y scale using the rev values
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(rev_time_data, (d) => d.value)])
      .range([height, 0]);

    // Append the y axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(y));

    // Define the line generator for the rev data
    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.value))
      .curve(d3.curveBasis);

    // Append the rev line to the SVG with animation
    const path = svg
      .append("path")
      .datum(rev_time_data)
      .attr("class", "line-rev")
      .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Add a legend
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", -4)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#a6507e");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", 3)
      .text("매출 (원)")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
  });
}

// time - both graph
function time_bothVis(marker, checker) {
  Promise.all([
    d3.csv("./data/population_filtered.csv"),
    d3.csv("./data/revenue_filtered.csv"),
  ]).then(function ([popData, revData]) {
    var target_year = "20234";
    var filteredRevData = revData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year &&
        d["상권_코드_명"] === marker &&
        d["서비스_업종_코드_명"] === document.getElementById("select").value
    );
    var filteredPopData = popData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year && d["상권_코드_명"] === marker
    );
    var pop_time_data = [
      // Extract the data from csv files
      {
        pop_time: "00~06",
        pop_value: parseInt(filteredPopData[0]["시간대_00_06_유동인구_수"]),
      },
      {
        pop_time: "06~11",
        pop_value: parseInt(filteredPopData[0]["시간대_06_11_유동인구_수"]),
      },
      {
        pop_time: "11~14",
        pop_value: parseInt(filteredPopData[0]["시간대_11_14_유동인구_수"]),
      },
      {
        pop_time: "14~17",
        pop_value: parseInt(filteredPopData[0]["시간대_14_17_유동인구_수"]),
      },
      {
        pop_time: "17~21",
        pop_value: parseInt(filteredPopData[0]["시간대_17_21_유동인구_수"]),
      },
      {
        pop_time: "21~24",
        pop_value: parseInt(filteredPopData[0]["시간대_21_24_유동인구_수"]),
      },
    ];

    var rev_time_data = [
      {
        rev_time: "00~06",
        rev_value: parseInt(filteredRevData[0]["시간대_00~06_매출_금액"]),
      },
      {
        rev_time: "06~11",
        rev_value: parseInt(filteredRevData[0]["시간대_06~11_매출_금액"]),
      },
      {
        rev_time: "11~14",
        rev_value: parseInt(filteredRevData[0]["시간대_11~14_매출_금액"]),
      },
      {
        rev_time: "14~17",
        rev_value: parseInt(filteredRevData[0]["시간대_14~17_매출_금액"]),
      },
      {
        rev_time: "17~21",
        rev_value: parseInt(filteredRevData[0]["시간대_17~21_매출_금액"]),
      },
      {
        rev_time: "21~24",
        rev_value: parseInt(filteredRevData[0]["시간대_21~24_매출_금액"]),
      },
    ];

    // Define the dimensions and margins of the graph
    const width = 500;
    const height = 300;
    const marginTop = 30;
    const marginBottom = 30;
    const marginRight = 80;
    const marginLeft = 60;

    // Create an SVG element and append it to the DOM
    const svg = d3
      .select("#time-graph")
      .append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    // Define the x scale using the pop time data
    const x = d3
      .scalePoint()
      .domain(pop_time_data.map((d) => d.pop_time))
      .range([0, width]);

    // Append the x axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Define the y scale using the pop values
    const yPop = d3
      .scaleLinear()
      .domain([0, d3.max(pop_time_data, (d) => d.pop_value)])
      .range([height, 0]);

    // Define the y scale using the rev values
    const yRev = d3
      .scaleLinear()
      .domain([0, d3.max(rev_time_data, (d) => d.rev_value)])
      .range([height, 0]);

    // Append the y axes to the SVG
    svg.append("g").call(d3.axisLeft(yPop));
    svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(yRev));

    // Define the line generator for the pop data
    const linePop = d3
      .line()
      .x((d) => x(d.pop_time))
      .y((d) => yPop(d.pop_value))
      .curve(d3.curveBasis);

    // Define the line generator for the rev data
    const lineRev = d3
      .line()
      .x((d) => x(d.rev_time))
      .y((d) => yRev(d.rev_value))
      .curve(d3.curveBasis);

    // Append the pop line to the SVG with animation
    const popPath = svg
      .append("path")
      .datum(pop_time_data)
      .attr("class", "line-pop")
      .attr("d", linePop);

    const popTotalLength = popPath.node().getTotalLength();

    popPath
      .attr("stroke-dasharray", `${popTotalLength} ${popTotalLength}`)
      .attr("stroke-dashoffset", popTotalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Append the rev line to the SVG with animation
    const revPath = svg
      .append("path")
      .datum(rev_time_data)
      .attr("class", "line-rev")
      .attr("d", lineRev);

    const revTotalLength = revPath.node().getTotalLength();

    revPath
      .attr("stroke-dasharray", `${revTotalLength} ${revTotalLength}`)
      .attr("stroke-dashoffset", revTotalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Add a legend for pop line
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", -20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#5785af");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", -13)
      .text("유동인구")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");

    // Add a legend for rev line
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", -4)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#a6507e");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", 3)
      .text("매출 (원)")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
  });
}

// date - population graph
function day_popVis(marker, checker) {
  d3.csv("./data/population_filtered.csv").then(function (data) {
    var target_year = "20234";
    var filteredData = data.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year && d["상권_코드_명"] === marker
    );
    // Extract the data from csv file
    var pop_day_data = [];
    pop_day_data[0] = {
      day: "월",
      value: parseInt(filteredData[0]["월요일_유동인구_수"]),
    };
    pop_day_data[1] = {
      day: "화",
      value: parseInt(filteredData[0]["화요일_유동인구_수"]),
    };
    pop_day_data[2] = {
      day: "수",
      value: parseInt(filteredData[0]["수요일_유동인구_수"]),
    };
    pop_day_data[3] = {
      day: "목",
      value: parseInt(filteredData[0]["목요일_유동인구_수"]),
    };
    pop_day_data[4] = {
      day: "금",
      value: parseInt(filteredData[0]["금요일_유동인구_수"]),
    };
    pop_day_data[5] = {
      day: "토",
      value: parseInt(filteredData[0]["토요일_유동인구_수"]),
    };
    pop_day_data[6] = {
      day: "일",
      value: parseInt(filteredData[0]["일요일_유동인구_수"]),
    };

    // Define the dimensions and margins of the graph
    const width = 500;
    const height = 300;
    const marginTop = 30;
    const marginBottom = 30;
    const marginRight = 80;
    const marginLeft = 60;

    // Create an SVG element and append it to the DOM
    const svg = d3
      .select("#day-graph")
      .append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    // Define the x scale using the day data
    const x = d3
      .scaleBand()
      .domain(pop_day_data.map((d) => d.day))
      .range([0, width])
      .padding(0.1);

    // Append the x axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Define the y scale using the pop values
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(pop_day_data, (d) => d.value)])
      .range([height, 0]);

    // Append the y axis to the SVG
    svg.append("g").call(d3.axisLeft(y));

    // Append the pop bars to the SVG with animation
    svg
      .selectAll(".bar-pop")
      .data(pop_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-pop")
      .attr("x", (d) => x(d.day))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));

    // Add a legend
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", 4)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#5785af");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", 11)
      .text("유동인구")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
  });
}

// date - revenue graph
function day_revVis(marker, checker) {
  d3.csv("./data/revenue_filtered.csv").then(function (data) {
    var target_year = "20234";
    var filteredData = data.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year &&
        d["상권_코드_명"] === marker &&
        d["서비스_업종_코드_명"] === document.getElementById("select").value
    );
    // Extract the data from csv file
    var rev_day_data = [];
    rev_day_data[0] = {
      day: "월",
      value: parseInt(filteredData[0]["월요일_매출_금액"]),
    };
    rev_day_data[1] = {
      day: "화",
      value: parseInt(filteredData[0]["화요일_매출_금액"]),
    };
    rev_day_data[2] = {
      day: "수",
      value: parseInt(filteredData[0]["수요일_매출_금액"]),
    };
    rev_day_data[3] = {
      day: "목",
      value: parseInt(filteredData[0]["목요일_매출_금액"]),
    };
    rev_day_data[4] = {
      day: "금",
      value: parseInt(filteredData[0]["금요일_매출_금액"]),
    };
    rev_day_data[5] = {
      day: "토",
      value: parseInt(filteredData[0]["토요일_매출_금액"]),
    };
    rev_day_data[6] = {
      day: "일",
      value: parseInt(filteredData[0]["일요일_매출_금액"]),
    };

    // Define the dimensions and margins of the graph
    const width = 500;
    const height = 300;
    const marginTop = 30;
    const marginBottom = 30;
    const marginRight = 80;
    const marginLeft = 60;

    // Create an SVG element and append it to the DOM
    const svg = d3
      .select("#day-graph")
      .append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    // Define the x scale using the day data
    const x = d3
      .scaleBand()
      .domain(rev_day_data.map((d) => d.day))
      .range([0, width])
      .padding(0.1);

    // Append the x axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Define the y scale using the rev values
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(rev_day_data, (d) => d.value)])
      .range([height, 0]);

    // Append the y axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(y));

    // Append the rev bars to the SVG with animation
    svg
      .selectAll(".bar-rev")
      .data(rev_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-rev")
      .attr("x", (d) => x(d.day))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));

    // Add a legend
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", 4)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#a6507e");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", 11)
      .text("매출 (원)")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
  });
}

// date - both graph
function day_bothVis(marker, checker) {
  // Extract the data from csv files
  Promise.all([
    d3.csv("./data/population_filtered.csv"),
    d3.csv("./data/revenue_filtered.csv"),
  ]).then(function ([popData, revData]) {
    var target_year = "20234";
    var filteredRevData = revData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year &&
        d["상권_코드_명"] === marker &&
        d["서비스_업종_코드_명"] === document.getElementById("select").value
    );
    var filteredPopData = popData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year && d["상권_코드_명"] === marker
    );
    var pop_day_data = [
      {
        pop_day: "월",
        pop_value: parseInt(filteredPopData[0]["월요일_유동인구_수"]),
      },
      {
        pop_day: "화",
        pop_value: parseInt(filteredPopData[0]["화요일_유동인구_수"]),
      },
      {
        pop_day: "수",
        pop_value: parseInt(filteredPopData[0]["수요일_유동인구_수"]),
      },
      {
        pop_day: "목",
        pop_value: parseInt(filteredPopData[0]["목요일_유동인구_수"]),
      },
      {
        pop_day: "금",
        pop_value: parseInt(filteredPopData[0]["금요일_유동인구_수"]),
      },
      {
        pop_day: "토",
        pop_value: parseInt(filteredPopData[0]["토요일_유동인구_수"]),
      },
      {
        pop_day: "일",
        pop_value: parseInt(filteredPopData[0]["일요일_유동인구_수"]),
      },
    ];

    var rev_day_data = [
      {
        rev_day: "월",
        rev_value: parseInt(filteredRevData[0]["월요일_매출_금액"]),
      },
      {
        rev_day: "화",
        rev_value: parseInt(filteredRevData[0]["화요일_매출_금액"]),
      },
      {
        rev_day: "수",
        rev_value: parseInt(filteredRevData[0]["수요일_매출_금액"]),
      },
      {
        rev_day: "목",
        rev_value: parseInt(filteredRevData[0]["목요일_매출_금액"]),
      },
      {
        rev_day: "금",
        rev_value: parseInt(filteredRevData[0]["금요일_매출_금액"]),
      },
      {
        rev_day: "토",
        rev_value: parseInt(filteredRevData[0]["토요일_매출_금액"]),
      },
      {
        rev_day: "일",
        rev_value: parseInt(filteredRevData[0]["일요일_매출_금액"]),
      },
    ];

    // Define the dimensions and margins of the graph
    const width = 500;
    const height = 300;
    const marginTop = 30;
    const marginBottom = 30;
    const marginRight = 80;
    const marginLeft = 60;

    // Create an SVG element and append it to the DOM
    const svg = d3
      .select("#day-graph")
      .append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    // Define the x scale using the time data
    const x = d3
      .scaleBand()
      .domain(pop_day_data.map((d) => d.pop_day))
      .range([0, width])
      .padding(0.1);

    // Append the x axis to the SVG
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Define the y scale using the pop values
    const yPop = d3
      .scaleLinear()
      .domain([0, d3.max(pop_day_data, (d) => d.pop_value)])
      .range([height, 0]);

    // Define the y scale using the rev values
    const yRev = d3
      .scaleLinear()
      .domain([0, d3.max(rev_day_data, (d) => d.rev_value)])
      .range([height, 0]);

    // Append the y axes to the SVG
    svg.append("g").call(d3.axisLeft(yPop));
    svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(yRev));

    // Append the pop bars to the SVG with animation
    svg
      .selectAll(".bar-pop")
      .data(pop_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-pop")
      .attr("x", (d) => x(d.pop_day))
      .attr("y", height)
      .attr("width", x.bandwidth() / 2)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", (d) => yPop(d.pop_value))
      .attr("height", (d) => height - yPop(d.pop_value));

    // Append the rev bars to the SVG with animation
    svg
      .selectAll(".bar-rev")
      .data(rev_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-rev")
      .attr("x", (d) => x(d.rev_day) + x.bandwidth() / 2)
      .attr("y", height)
      .attr("width", x.bandwidth() / 2)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", (d) => yRev(d.rev_value))
      .attr("height", (d) => height - yRev(d.rev_value));

    // Add a legend for pop bars
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", -20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#5785af");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", -13)
      .text("유동인구")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");

    // Add a legend for rev bars
    svg
      .append("rect")
      .attr("x", width + 10)
      .attr("y", -4)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#a6507e");
    svg
      .append("text")
      .attr("x", width + 25)
      .attr("y", 3)
      .text("매출 (원)")
      .style("font-size", "12px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle");
  });
}

// sankey chart
function time_sankeyVis(marker, checker) {
  const weight = 0.004; // weight for pop - rev
  // Extract the data from csv files
  Promise.all([
    d3.csv("./data/population_filtered.csv"),
    d3.csv("./data/revenue_filtered.csv"),
  ]).then(function ([popData, revData]) {
    var target_year = "20234";
    var filteredRevData = revData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year &&
        d["상권_코드_명"] === marker &&
        d["서비스_업종_코드_명"] === document.getElementById("select").value
    );
    var filteredPopData = popData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year && d["상권_코드_명"] === marker
    );

    var popDataFull =
      parseInt(filteredPopData[0]["시간대_00_06_유동인구_수"]) +
      parseInt(filteredPopData[0]["시간대_06_11_유동인구_수"]) +
      parseInt(filteredPopData[0]["시간대_11_14_유동인구_수"]) +
      parseInt(filteredPopData[0]["시간대_14_17_유동인구_수"]) +
      parseInt(filteredPopData[0]["시간대_17_21_유동인구_수"]) +
      parseInt(filteredPopData[0]["시간대_21_24_유동인구_수"]);
    var revDataFull =
      parseInt(filteredRevData[0]["시간대_00~06_매출_금액"]) +
      parseInt(filteredRevData[0]["시간대_06~11_매출_금액"]) +
      parseInt(filteredRevData[0]["시간대_11~14_매출_금액"]) +
      parseInt(filteredRevData[0]["시간대_14~17_매출_금액"]) +
      parseInt(filteredRevData[0]["시간대_17~21_매출_금액"]) +
      parseInt(filteredRevData[0]["시간대_21~24_매출_금액"]);

    const pop_time_data = [
      {
        time: "00~06",
        value:
          parseInt(filteredPopData[0]["시간대_00_06_유동인구_수"]) /
          popDataFull,
      },
      {
        time: "06~11",
        value:
          parseInt(filteredPopData[0]["시간대_06_11_유동인구_수"]) /
          popDataFull,
      },
      {
        time: "11~14",
        value:
          parseInt(filteredPopData[0]["시간대_11_14_유동인구_수"]) /
          popDataFull,
      },
      {
        time: "14~17",
        value:
          parseInt(filteredPopData[0]["시간대_14_17_유동인구_수"]) /
          popDataFull,
      },
      {
        time: "17~21",
        value:
          parseInt(filteredPopData[0]["시간대_17_21_유동인구_수"]) /
          popDataFull,
      },
      {
        time: "21~24",
        value:
          parseInt(filteredPopData[0]["시간대_21_24_유동인구_수"]) /
          popDataFull,
      },
    ];

    const rev_time_data = [
      {
        time: "00~06",
        value:
          parseInt(filteredRevData[0]["시간대_00~06_매출_금액"]) / revDataFull,
      },
      {
        time: "06~11",
        value:
          parseInt(filteredRevData[0]["시간대_06~11_매출_금액"]) / revDataFull,
      },
      {
        time: "11~14",
        value:
          parseInt(filteredRevData[0]["시간대_11~14_매출_금액"]) / revDataFull,
      },
      {
        time: "14~17",
        value:
          parseInt(filteredRevData[0]["시간대_14~17_매출_금액"]) / revDataFull,
      },
      {
        time: "17~21",
        value:
          parseInt(filteredRevData[0]["시간대_17~21_매출_금액"]) / revDataFull,
      },
      {
        time: "21~24",
        value:
          parseInt(filteredRevData[0]["시간대_21~24_매출_금액"]) / revDataFull,
      },
    ];

    // Create the Sankey diagram data structure
    const data = {
      nodes: [
        { name: "00~06" },
        { name: "06~11" },
        { name: "11~14" },
        { name: "14~17" },
        { name: "17~21" },
        { name: "21~24" },
        { name: "유동인구" },
        { name: "매출" },
      ],
      links: [
        { source: 6, target: 0, value: pop_time_data[0].value },
        { source: 6, target: 1, value: pop_time_data[1].value },
        { source: 6, target: 2, value: pop_time_data[2].value },
        { source: 6, target: 3, value: pop_time_data[3].value },
        { source: 6, target: 4, value: pop_time_data[4].value },
        { source: 6, target: 5, value: pop_time_data[5].value },
        { source: 0, target: 7, value: rev_time_data[0].value },
        { source: 1, target: 7, value: rev_time_data[1].value },
        { source: 2, target: 7, value: rev_time_data[2].value },
        { source: 3, target: 7, value: rev_time_data[3].value },
        { source: 4, target: 7, value: rev_time_data[4].value },
        { source: 5, target: 7, value: rev_time_data[5].value },
      ],
    };

    const width = 600;
    const height = 380;
    const offset = 25;

    // Create the SVG container
    const svg = d3
      .select("#time-sankey-chart")
      .append("svg")
      .attr("width", width + offset)
      .attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${offset},0)`);

    // Define the Sankey diagram properties
    const sankey = d3
      .sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 1],
        [width - 1, height - 6],
      ]);

    const { nodes, links } = sankey({
      nodes: data.nodes.map((d) => Object.assign({}, d)),
      links: data.links.map((d) => Object.assign({}, d)),
    });
    console.log(nodes);
    console.log(links);

    // Manually set node positions
    nodes.forEach((node) => {
      if (node.name === "유동인구") {
        node.x0 = 0;
        node.x1 = 15;
      } else if (node.name === "매출") {
        node.x0 = width - 15;
        node.x1 = width;
      } else if (node.name.includes("~")) {
        node.x0 = (width - 15) / 2;
        node.x1 = (width + 15) / 2;
      }
    });

    // Create the Sankey links with animation
    const link = g
      .append("g")
      .attr("fill", "none")
      // .attr("stroke", "white")
      // .attr("stroke-opacity", 0.2)
      .selectAll("path")
      .data(links)
      .enter()
      .append("g");

    // // Create gradient definition
    // const defs = svg.append("defs");

    // // Define gradient
    // const gradient = defs
    //   .append("linearGradient")
    //   .attr("id", "linkGradient")
    //   .attr("gradientUnits", "userSpaceOnUse")
    //   .attr("x1", "0%")
    //   .attr("y1", "0%")
    //   .attr("x2", "100%")
    //   .attr("y2", "0%");

    // gradient.append("stop").attr("offset", "50%").attr("stop-color", "purple");

    // gradient.append("stop").attr("offset", "100%").attr("stop-color", "red");

    // Add border path
    link
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", (d) => Math.max(1, d.width + 2)) // Add border width
      //.attr("stroke", "white") // Border color
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", function (d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function (d) {
        return this.getTotalLength();
      })
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    link
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", (d) => Math.max(1, d.width))
      .attr("stroke-opacity", (d) => d.width / 50) // Adjust opacity based on width
      // .attr("stroke", (d) => `rgba(0, 250, 0, ${d.width / 70})`) // Adjust color intensity based on width
      .attr("stroke", "#C6C6C6")
      .attr("stroke-dasharray", function (d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function (d) {
        return this.getTotalLength();
      })
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    // Create the Sankey nodes with animation
    const node = g
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("fill", (d) => {
        if (d.name === "유동인구") return "#5785af";
        if (d.name === "매출") return "#a6507e";
        return "#8968A2";
      })
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Add text labels to the nodes with animation
    g.append("g")
      .style("font", "16px sans-serif")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .style("fill", "white")
      .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
      .text((d) => d.name)
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(1000)
      .style("opacity", 1);
  });
}

function day_sankeyVis(marker, checker) {
  const weight = 0.004; // weight for pop - rev

  // Extract the data from csv files
  Promise.all([
    d3.csv("./data/population_filtered.csv"),
    d3.csv("./data/revenue_filtered.csv"),
  ]).then(function ([popData, revData]) {
    var target_year = "20234";
    var filteredRevData = revData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year &&
        d["상권_코드_명"] === marker &&
        d["서비스_업종_코드_명"] === document.getElementById("select").value
    );
    var filteredPopData = popData.filter(
      (d) =>
        d["기준_년분기_코드"] === target_year && d["상권_코드_명"] === marker
    );

    var popDataFull =
      parseInt(filteredPopData[0]["월요일_유동인구_수"]) +
      parseInt(filteredPopData[0]["화요일_유동인구_수"]) +
      parseInt(filteredPopData[0]["수요일_유동인구_수"]) +
      parseInt(filteredPopData[0]["목요일_유동인구_수"]) +
      parseInt(filteredPopData[0]["금요일_유동인구_수"]) +
      parseInt(filteredPopData[0]["토요일_유동인구_수"]) +
      parseInt(filteredPopData[0]["일요일_유동인구_수"]);
    var revDataFull =
      parseInt(filteredRevData[0]["월요일_매출_금액"]) +
      parseInt(filteredRevData[0]["화요일_매출_금액"]) +
      parseInt(filteredRevData[0]["수요일_매출_금액"]) +
      parseInt(filteredRevData[0]["목요일_매출_금액"]) +
      parseInt(filteredRevData[0]["금요일_매출_금액"]) +
      parseInt(filteredRevData[0]["토요일_매출_금액"]) +
      parseInt(filteredRevData[0]["일요일_매출_금액"]);

    const pop_day_data = [
      {
        day: "월",
        value: parseInt(filteredPopData[0]["월요일_유동인구_수"]) / popDataFull,
      },
      {
        day: "화",
        value: parseInt(filteredPopData[0]["화요일_유동인구_수"]) / popDataFull,
      },
      {
        day: "수",
        value: parseInt(filteredPopData[0]["수요일_유동인구_수"]) / popDataFull,
      },
      {
        day: "목",
        value: parseInt(filteredPopData[0]["목요일_유동인구_수"]) / popDataFull,
      },
      {
        day: "금",
        value: parseInt(filteredPopData[0]["금요일_유동인구_수"]) / popDataFull,
      },
      {
        day: "토",
        value: parseInt(filteredPopData[0]["토요일_유동인구_수"]) / popDataFull,
      },
      {
        day: "일",
        value: parseInt(filteredPopData[0]["일요일_유동인구_수"]) / popDataFull,
      },
    ];

    const rev_day_data = [
      {
        day: "월",
        value: parseInt(filteredRevData[0]["월요일_매출_금액"]) / revDataFull,
      },
      {
        day: "화",
        value: parseInt(filteredRevData[0]["화요일_매출_금액"]) / revDataFull,
      },
      {
        day: "수",
        value: parseInt(filteredRevData[0]["수요일_매출_금액"]) / revDataFull,
      },
      {
        day: "목",
        value: parseInt(filteredRevData[0]["목요일_매출_금액"]) / revDataFull,
      },
      {
        day: "금",
        value: parseInt(filteredRevData[0]["금요일_매출_금액"]) / revDataFull,
      },
      {
        day: "토",
        value: parseInt(filteredRevData[0]["토요일_매출_금액"]) / revDataFull,
      },
      {
        day: "일",
        value: parseInt(filteredRevData[0]["일요일_매출_금액"]) / revDataFull,
      },
    ];
    console.log(pop_day_data);
    console.log(rev_day_data);

    // Create the Sankey diagram data structure
    const data = {
      nodes: [
        { name: "월" },
        { name: "화" },
        { name: "수" },
        { name: "목" },
        { name: "금" },
        { name: "토" },
        { name: "일" },
        { name: "유동인구" },
        { name: "매출" },
      ],
      links: [
        { source: 7, target: 0, value: pop_day_data[0].value },
        { source: 7, target: 1, value: pop_day_data[1].value },
        { source: 7, target: 2, value: pop_day_data[2].value },
        { source: 7, target: 3, value: pop_day_data[3].value },
        { source: 7, target: 4, value: pop_day_data[4].value },
        { source: 7, target: 5, value: pop_day_data[5].value },
        { source: 7, target: 6, value: pop_day_data[6].value },
        { source: 0, target: 8, value: rev_day_data[0].value },
        { source: 1, target: 8, value: rev_day_data[1].value },
        { source: 2, target: 8, value: rev_day_data[2].value },
        { source: 3, target: 8, value: rev_day_data[3].value },
        { source: 4, target: 8, value: rev_day_data[4].value },
        { source: 5, target: 8, value: rev_day_data[5].value },
        { source: 6, target: 8, value: rev_day_data[6].value },
      ],
    };

    const width = 600;
    const height = 380;
    const offset = 25;

    // Create the SVG container
    const svg = d3
      .select("#day-sankey-chart")
      .append("svg")
      .attr("width", width + offset)
      .attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${offset},0)`);

    // Define the Sankey diagram properties
    const sankey = d3
      .sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 1],
        [width - 1, height - 6],
      ]);

    const { nodes, links } = sankey({
      nodes: data.nodes.map((d) => Object.assign({}, d)),
      links: data.links.map((d) => Object.assign({}, d)),
    });

    // Manually set node positions
    nodes.forEach((node) => {
      if (node.name === "유동인구") {
        node.x0 = 0;
        node.x1 = 15;
      } else if (node.name === "매출") {
        node.x0 = width - 15;
        node.x1 = width;
      } else {
        node.x0 = (width - 15) / 2;
        node.x1 = (width + 15) / 2;
      }
    });

    // Create the Sankey links with animation
    const link = g
      .append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(links)
      .enter()
      .append("g");

    // Add border path
    link
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", (d) => Math.max(1, d.width + 2)) // Add border width
      //.attr("stroke", "gray") // Border color
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", function (d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function (d) {
        return this.getTotalLength();
      })
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    link
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", (d) => Math.max(1, d.width))
      .attr("stroke-opacity", (d) => d.width / 50) // Adjust opacity based on width
      //.attr("stroke", (d) => `rgba(0, 250, 0, ${d.width / 70})`) // Adjust color intensity based on width
      .attr("stroke", "#C6C6C6")
      .attr("stroke-dasharray", function (d) {
        return this.getTotalLength();
      })
      .attr("stroke-dashoffset", function (d) {
        return this.getTotalLength();
      })
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    // Create the Sankey nodes with animation
    const node = g
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("fill", (d) => {
        if (d.name === "유동인구") return "#5785af";
        if (d.name === "매출") return "#a6507e";
        return "#8968A2";
      })
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Add text labels to the nodes with animation
    g.append("g")
      .style("font", "16px sans-serif")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .style("fill", "white")
      .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
      .text((d) => d.name)
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(1000)
      .style("opacity", 1);
  });
}

function getVisualization(marker, checker) {
  // Remove all existing elements
  d3.select("#time-graph").selectAll("*").remove();
  d3.select("#day-graph").selectAll("*").remove();
  d3.select("#time-sankey-chart").selectAll("*").remove();
  d3.select("#day-sankey-chart").selectAll("*").remove();

  if (checker === "pop") {
    time_popVis(marker, checker);
    day_popVis(marker, checker);
  } else if (checker === "rev") {
    time_revVis(marker, checker);
    day_revVis(marker, checker);
  } else if (checker === "both") {
    time_bothVis(marker, checker);
    day_bothVis(marker, checker);
  } else if (checker === "sankey") {
    time_sankeyVis(marker, checker);
    day_sankeyVis(marker, checker);
  } else if (checker === "pop_sankey") {
    time_popVis(marker, checker);
    day_popVis(marker, checker);
    time_sankeyVis(marker, checker);
    day_sankeyVis(marker, checker);
  } else if (checker === "rev_sankey") {
    time_revVis(marker, checker);
    day_revVis(marker, checker);
    time_sankeyVis(marker, checker);
    day_sankeyVis(marker, checker);
  } else if (checker === "all") {
    time_bothVis(marker, checker);
    day_bothVis(marker, checker);
    time_sankeyVis(marker, checker);
    day_sankeyVis(marker, checker);
  }
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  //layer.bringToFront();
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function getRegionData(feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
}

// function onEachFeature(feature, layer) {
//   layer.on({
//     mouseover: highlightFeature,
//     mouseout: resetHighlight,
//     click: getRegionData(feature, layer),
//   });
// }

d3.csv("./data/revenue_filtered.csv").then(function (data) {
  console.log(data);

  // d3.json("../data/map.geojson")
  //   .then((geojson) => {
  //     var bbox = d3.select("#map").node().getBoundingClientRect();
  //     var w = 1200;
  //     var h = 1060;
  //     //var svg = d3.select("#map").append("svg").attr("width", w).attr("height", h);

  //     // var projection = d3
  //     //   .geoMercator()
  //     //   .scale(100)
  //     //   .translate([w / 2, h / 2]);
  //     var projection = d3.geoEqualEarth();
  //     projection.fitExtent(
  //       [
  //         [20, 20],
  //         [w, h],
  //       ],
  //       geojson
  //     );
  //     var geoGenerator = d3.geoPath().projection(projection);
  //     var svg = d3
  //       .select("#map")
  //       .append("svg")
  //       .style("width", "100%")
  //       .style("height", "100%");

  //     //var path = d3.geoPath().projection(projection);

  //     console.log(geojson);
  //     console.log(geojson.features);
  //     svg
  //       .selectAll("path")
  //       .data(geojson.features)
  //       .enter()
  //       .append("path")
  //       .attr("class", "land")
  //       .attr("d", geoGenerator);
  //     //.attr("d", path);
  //   })
  //   .catch((error) => {
  //     console.error("Error loading the GeoJSON data: ", error);
  //   });
});

d3.csv("./data/population_filtered.csv").then(function (data) {
  console.log(data);

  // Create a Leaflet map centered at a specific location and zoom level
  var map = L.map("map").setView([37.5635, 126.936], 14.5);

  L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
      attribution:
        "Map data © OpenStreetMap contributors, CC-BY-SA, Imagery © Stamen Design",
    }
  ).addTo(map);

  // Add a tile layer from OpenStreetMap
  // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //   maxZoom: 19,
  //   attribution:
  //     'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  // }).addTo(map);

  // Load GeoJSON data and add it to the map
  fetch("./data/map.geojson")
    .then((response) => response.json())
    .then((data) => {
      geojson = L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            //click: getRegionData(feature, layer),
          });
        },
      }).addTo(map);
      var regions = document.getElementsByClassName("leaflet-interactive");
      for (var i = 0; i < regions.length; i++) {
        regions[i].innerHTML = regionList[i];
        //console.log(regions[i]);
        regions[i].addEventListener("click", (e) => {
          //console.log(e.target);
          getMarkerValue(e);
        });
      }
    });
});

fetch("../data/marker.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    } else {
      return response.json();
    }
  })
  .then((data) => {
    markerArray = data;
    // console.log(markerArray);
    // getMarkerValue();
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

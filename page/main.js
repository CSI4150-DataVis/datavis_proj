//import rev_day_graph from "./detail/revenue/rev_day.js";
//import { getMapData } from "./map/map.js";
//import { checkboxData } from "./map/checkbox.js";

// global variable
var marker = 0;
var checker = null;

// event handler functions
function getCheckboxValue(event) {
  let result = "";
  if (event.target.checked) {
    checker = event.target.value;
  } else {
    checker = null;
    parent = document.getElementById("rev-graph");
    parent.removeChild(parent.lastChild);
  }
  console.log(checker);
  getVisualization(marker, checker);
}

function getMarkerValue(event) {
  // marker가 클릭되지 않았을 경우
  // marker 값을 받아오고 크기를 키워줌
  // select 업데이트

  // marker가 클릭되어 있던 경우
  // marker 값을 지우고 크기를 줄여줌
  // select 업데이트

  getVisualization(marker, checker);
}

function makeSelectBox(code) {
    var 
}

// visualization function
// population - date graph
function pop_dateVis(marker, checker) {}

// population - time graph
function pop_timeVis(marker, checker) {}

// revenue - date graph
function rev_dateVis(marker, checker) {}

// revenue - time graph
function rev_timeVis(marker, checker) {
  d3.csv("./data/revenue_filtered.csv").then(function (data) {
    var time_data = [];
    time_data[0] = new Object();
    time_data[0].time = "00~06";
    time_data[0].value = parseInt(data[0]["시간대_00~06_매출_금액"]);

    time_data[1] = new Object();
    time_data[1].time = "06~11";
    time_data[1].value = parseInt(data[0]["시간대_06~11_매출_금액"]);

    time_data[2] = new Object();
    time_data[2].time = "11~14";
    time_data[2].value = parseInt(data[0]["시간대_11~14_매출_금액"]);

    time_data[3] = new Object();
    time_data[3].time = "14~17";
    time_data[3].value = parseInt(data[0]["시간대_14~17_매출_금액"]);

    time_data[4] = new Object();
    time_data[4].time = "17~21";
    time_data[4].value = parseInt(data[0]["시간대_17~21_매출_금액"]);

    time_data[5] = new Object();
    time_data[5].time = "21~24";
    time_data[5].value = parseInt(data[0]["시간대_21~24_매출_금액"]);

    const width = 500;
    const height = 300;
    const marginTop = 30;
    const marginBottom = 30;
    const marginRight = 30;
    const marginLeft = 30;

    console.log(time_data);

    const svg = d3
      .select(`#${"rev-graph"}`)
      .append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom)
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    const x = d3
      .scalePoint()
      .domain(time_data.map((d) => d.time))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(time_data, (d) => d.value)])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.value))
      .curve(d3.curveBasis);

    svg.append("path").datum(time_data).attr("class", "line").attr("d", line);
  });
}

function getVisualization(marker, checker) {
  if (marker != -1 && checker != null) {
    console.log("start visualization");
    if (checker == "date") {
      pop_dateVis(marker, checker);
      rev_dateVis(marker, checker);
    } else {
      pop_timeVis(marker, checker);
      rev_timeVis(marker, checker);
    }
  } else console.log("not all values are selected");
}

d3.csv("./data/revenue_filtered.csv").then(function (data) {
  console.log(data);
});

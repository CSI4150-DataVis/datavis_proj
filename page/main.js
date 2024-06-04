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
  }
  console.log(result);
  getVisualization(marker, checker);
}

function getMarkerValue(event) {
  // marker가 클릭되지 않았을 경우
  // marker 값을 받아오고 크기를 키워줌

  // marker가 클릭되어 있던 경우
  // marker 값을 지우고 크기를 줄여줌

  getVisualization(marker, checker);
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
    time_data = [
      data[0]["시간대_00~06_매출_금액"],
      data[0]["시간대_06~11_매출_금액"],
      data[0]["시간대_11~14_매출_금액"],
      data[0]["시간대_14~17_매출_금액"],
      data[0]["시간대_17~21_매출_금액"],
      data[0]["시간대_21~24_매출_금액"],
    ];
    console.log(time_data);
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

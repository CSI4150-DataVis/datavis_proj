//import rev_day_graph from "./detail/revenue/rev_day.js";
//import { getMapData } from "./map/map.js";
//import { checkboxData } from "./map/checkbox.js";

// Global variable
var marker = 0;
var checker = null;

// Event handler functions
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
  // marker가 클릭되지 않았을 경우
  // marker 값을 받아오고 크기를 키워줌
  // select 업데이트

  // marker가 클릭되어 있던 경우
  // marker 값을 지우고 크기를 줄여줌
  // select 업데이트

  getVisualization(marker, checker);
}

function makeSelectBox(code) {
}

// Visualization function
// time - population graph
function time_popVis(marker, checker) {
  // Extract the data from csv file
  d3.csv("./data/population_filtered.csv").then(function(data) {
    var pop_time_data = [];
    pop_time_data[0] = { time: "00~06", value: parseInt(data[0]["시간대_00_06_유동인구_수"]) };
    pop_time_data[1] = { time: "06~11", value: parseInt(data[0]["시간대_06_11_유동인구_수"]) };
    pop_time_data[2] = { time: "11~14", value: parseInt(data[0]["시간대_11_14_유동인구_수"]) };
    pop_time_data[3] = { time: "14~17", value: parseInt(data[0]["시간대_14_17_유동인구_수"]) };
    pop_time_data[4] = { time: "17~21", value: parseInt(data[0]["시간대_17_21_유동인구_수"]) };
    pop_time_data[5] = { time: "21~24", value: parseInt(data[0]["시간대_21_24_유동인구_수"]) };

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

    // Append the pop line to the SVG
    svg.append("path").datum(pop_time_data).attr("class", "line-pop").attr("d", line);

    // Add a legend
    svg.append("rect").attr("x", width + 10).attr("y", 4).attr("width", 10).attr("height", 10).attr("fill", "blue");
    svg.append("text").attr("x", width + 25).attr("y", 11).text("유동인구").style("font-size", "12px").attr("alignment-baseline", "middle");      
  });
}

// time - revenue graph
function time_revVis(marker, checker) {
  d3.csv("./data/revenue_filtered.csv").then(function(data) {
    // Extract the data from csv file
    var rev_time_data = [];
    rev_time_data[0] = { time: "00~06", value: parseInt(data[0]["시간대_00~06_매출_금액"]) };
    rev_time_data[1] = { time: "06~11", value: parseInt(data[0]["시간대_06~11_매출_금액"]) };
    rev_time_data[2] = { time: "11~14", value: parseInt(data[0]["시간대_11~14_매출_금액"]) };
    rev_time_data[3] = { time: "14~17", value: parseInt(data[0]["시간대_14~17_매출_금액"]) };
    rev_time_data[4] = { time: "17~21", value: parseInt(data[0]["시간대_17~21_매출_금액"]) };
    rev_time_data[5] = { time: "21~24", value: parseInt(data[0]["시간대_21~24_매출_금액"]) };

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
    svg.append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(y));

    // Define the line generator for the rev data
    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.value))
      .curve(d3.curveBasis);

    // Append the rev line to the SVG
    svg.append("path").datum(rev_time_data).attr("class", "line-rev").attr("d", line);

    // Add a legend
    svg.append("rect").attr("x", width + 10).attr("y", -4).attr("width", 10).attr("height", 10).attr("fill", "red");
    svg.append("text").attr("x", width + 25).attr("y", 3).text("매출 (원)").style("font-size", "12px").attr("alignment-baseline", "middle");      
  });
}

// time - both graph
function time_bothVis(marker, checker) {
  Promise.all([
    d3.csv("./data/population_filtered.csv"),
    d3.csv("./data/revenue_filtered.csv")
  ]).then(function([popData, revData]) {
    var pop_time_data = [
      // Extract the data from csv files
      { pop_time: "00~06", pop_value: parseInt(popData[0]["시간대_00_06_유동인구_수"]) },
      { pop_time: "06~11", pop_value: parseInt(popData[0]["시간대_06_11_유동인구_수"]) },
      { pop_time: "11~14", pop_value: parseInt(popData[0]["시간대_11_14_유동인구_수"]) },
      { pop_time: "14~17", pop_value: parseInt(popData[0]["시간대_14_17_유동인구_수"]) },
      { pop_time: "17~21", pop_value: parseInt(popData[0]["시간대_17_21_유동인구_수"]) },
      { pop_time: "21~24", pop_value: parseInt(popData[0]["시간대_21_24_유동인구_수"]) }
    ];

    var rev_time_data = [
      { rev_time: "00~06", rev_value: parseInt(revData[0]["시간대_00~06_매출_금액"]) },
      { rev_time: "06~11", rev_value: parseInt(revData[0]["시간대_06~11_매출_금액"]) },
      { rev_time: "11~14", rev_value: parseInt(revData[0]["시간대_11~14_매출_금액"]) },
      { rev_time: "14~17", rev_value: parseInt(revData[0]["시간대_14~17_매출_금액"]) },
      { rev_time: "17~21", rev_value: parseInt(revData[0]["시간대_17~21_매출_금액"]) },
      { rev_time: "21~24", rev_value: parseInt(revData[0]["시간대_21~24_매출_금액"]) }
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
    svg.append("g").attr("transform", `translate(${width}, 0)`).call(d3.axisRight(yRev));

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

    // Append the pop line to the SVG
    svg.append("path").datum(pop_time_data).attr("class", "line-pop").attr("d", linePop);
    // Append the rev line to the SVG
    svg.append("path").datum(rev_time_data).attr("class", "line-rev").attr("d", lineRev);

    // Add a legend for pop line
    svg.append("rect").attr("x", width + 10).attr("y", -20).attr("width", 10).attr("height", 10).attr("fill", "blue");
    svg.append("text").attr("x", width + 25).attr("y", -13).text("유동인구").style("font-size", "12px").attr("alignment-baseline", "middle"); 
    
    // Add a legend for rev line
    svg.append("rect").attr("x", width + 10).attr("y", -4).attr("width", 10).attr("height", 10).attr("fill", "red");
    svg.append("text").attr("x", width + 25).attr("y", 3).text("매출 (원)").style("font-size", "12px").attr("alignment-baseline", "middle");        

  });
}

// date - population graph
function day_popVis(marker, checker) {
  d3.csv("./data/population_filtered.csv").then(function(data) {
    // Extract the data from csv file
    var pop_day_data = [];
    pop_day_data[0] = { day: "월", value: parseInt(data[0]["월요일_유동인구_수"]) };
    pop_day_data[1] = { day: "화", value: parseInt(data[0]["화요일_유동인구_수"]) };
    pop_day_data[2] = { day: "수", value: parseInt(data[0]["수요일_유동인구_수"]) };
    pop_day_data[3] = { day: "목", value: parseInt(data[0]["목요일_유동인구_수"]) };
    pop_day_data[4] = { day: "금", value: parseInt(data[0]["금요일_유동인구_수"]) };
    pop_day_data[5] = { day: "토", value: parseInt(data[0]["토요일_유동인구_수"]) };
    pop_day_data[6] = { day: "일", value: parseInt(data[0]["일요일_유동인구_수"]) };

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

    // Append the pop bars to the SVG
    svg.selectAll(".bar-pop")
      .data(pop_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-pop")
      .attr("x", (d) => x(d.day))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))

    // Add a legend
    svg.append("rect").attr("x", width + 10).attr("y", 4).attr("width", 10).attr("height", 10).attr("fill", "blue");
    svg.append("text").attr("x", width + 25).attr("y", 11).text("유동인구").style("font-size", "12px").attr("alignment-baseline", "middle");      
  });
}

// date - revenue graph
function day_revVis(marker, checker) {
  d3.csv("./data/revenue_filtered.csv").then(function(data) {
    // Extract the data from csv file
    var rev_day_data = [];
    rev_day_data[0] = { day: "월", value: parseInt(data[0]["월요일_매출_금액"]) };
    rev_day_data[1] = { day: "화", value: parseInt(data[0]["화요일_매출_금액"]) };
    rev_day_data[2] = { day: "수", value: parseInt(data[0]["수요일_매출_금액"]) };
    rev_day_data[3] = { day: "목", value: parseInt(data[0]["목요일_매출_금액"]) };
    rev_day_data[4] = { day: "금", value: parseInt(data[0]["금요일_매출_금액"]) };
    rev_day_data[5] = { day: "토", value: parseInt(data[0]["토요일_매출_금액"]) };
    rev_day_data[6] = { day: "일", value: parseInt(data[0]["일요일_매출_금액"]) };

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
    svg.append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(y));

    // Append the rev bars to the SVG
    svg.selectAll(".bar-rev")
      .data(rev_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-rev")
      .attr("x", (d) => x(d.day))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))

    // Add a legend
    svg.append("rect").attr("x", width + 10).attr("y", 4).attr("width", 10).attr("height", 10).attr("fill", "red");
    svg.append("text").attr("x", width + 25).attr("y", 11).text("매출 (원)").style("font-size", "12px").attr("alignment-baseline", "middle");
  });
}

// date - both graph
function day_bothVis(marker, checker) {
  // Extract the data from csv files
  Promise.all([
    d3.csv("./data/population_filtered.csv"),
    d3.csv("./data/revenue_filtered.csv")
  ]).then(function([popData, revData]) {
    var pop_day_data = [
      { pop_day: "월", pop_value: parseInt(popData[0]["월요일_유동인구_수"]) },
      { pop_day: "화", pop_value: parseInt(popData[0]["화요일_유동인구_수"]) },
      { pop_day: "수", pop_value: parseInt(popData[0]["수요일_유동인구_수"]) },
      { pop_day: "목", pop_value: parseInt(popData[0]["목요일_유동인구_수"]) },
      { pop_day: "금", pop_value: parseInt(popData[0]["금요일_유동인구_수"]) },
      { pop_day: "토", pop_value: parseInt(popData[0]["토요일_유동인구_수"]) },
      { pop_day: "일", pop_value: parseInt(popData[0]["일요일_유동인구_수"]) }
    ];

    var rev_day_data = [
      { rev_day: "월", rev_value: parseInt(revData[0]["월요일_매출_금액"]) },
      { rev_day: "화", rev_value: parseInt(revData[0]["화요일_매출_금액"]) },
      { rev_day: "수", rev_value: parseInt(revData[0]["수요일_매출_금액"]) },
      { rev_day: "목", rev_value: parseInt(revData[0]["목요일_매출_금액"]) },
      { rev_day: "금", rev_value: parseInt(revData[0]["금요일_매출_금액"]) },
      { rev_day: "토", rev_value: parseInt(revData[0]["토요일_매출_금액"]) },
      { rev_day: "일", rev_value: parseInt(revData[0]["일요일_매출_금액"]) }
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
    svg.append("g").attr("transform", `translate(${width}, 0)`).call(d3.axisRight(yRev));

    // Append the pop bars to the SVG
    svg.selectAll(".bar-pop")
      .data(pop_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-pop")
      .attr("x", (d) => x(d.pop_day))
      .attr("y", (d) => yPop(d.pop_value))
      .attr("width", x.bandwidth() / 2)
      .attr("height", (d) => height - yPop(d.pop_value))

    // Append the rev bars to the SVG
    svg.selectAll(".bar-rev")
      .data(rev_day_data)
      .enter()
      .append("rect")
      .attr("class", "bar-rev")
      .attr("x", (d) => x(d.rev_day) + x.bandwidth() / 2)
      .attr("y", (d) => yRev(d.rev_value))
      .attr("width", x.bandwidth() / 2)
      .attr("height", (d) => height - yRev(d.rev_value))

    // Add a legend for pop bars
    svg.append("rect").attr("x", width + 10).attr("y", -20).attr("width", 10).attr("height", 10).attr("fill", "blue");
    svg.append("text").attr("x", width + 25).attr("y", -13).text("유동인구").style("font-size", "12px").attr("alignment-baseline", "middle"); 
    
    // Add a legend for rev bars
    svg.append("rect").attr("x", width + 10).attr("y", -4).attr("width", 10).attr("height", 10).attr("fill", "red");
    svg.append("text").attr("x", width + 25).attr("y", 3).text("매출 (원)").style("font-size", "12px").attr("alignment-baseline", "middle");    
  });
}

// sankey chart
function sankeyVis(marker, checker) {
  // weight (pop - rev)
  weight = 0.004
  // Extract the data from csv files
  Promise.all([
    d3.csv("./data/population_filtered.csv"),
    d3.csv("./data/revenue_filtered.csv")
  ]).then(function([popData, revData]) {
    const pop_time_data = [
      { time: "00~06", value: parseInt(popData[0]["시간대_00_06_유동인구_수"])},
      { time: "06~11", value: parseInt(popData[0]["시간대_06_11_유동인구_수"])},
      { time: "11~14", value: parseInt(popData[0]["시간대_11_14_유동인구_수"])},
      { time: "14~17", value: parseInt(popData[0]["시간대_14_17_유동인구_수"])},
      { time: "17~21", value: parseInt(popData[0]["시간대_17_21_유동인구_수"])},
      { time: "21~24", value: parseInt(popData[0]["시간대_21_24_유동인구_수"])}
    ];

    const rev_time_data = [
      { time: "00~06", value: parseInt(revData[0]["시간대_00~06_매출_금액"]) * weight},
      { time: "06~11", value: parseInt(revData[0]["시간대_06~11_매출_금액"]) * weight},
      { time: "11~14", value: parseInt(revData[0]["시간대_11~14_매출_금액"]) * weight},
      { time: "14~17", value: parseInt(revData[0]["시간대_14~17_매출_금액"]) * weight},
      { time: "17~21", value: parseInt(revData[0]["시간대_17~21_매출_금액"]) * weight},
      { time: "21~24", value: parseInt(revData[0]["시간대_21~24_매출_금액"]) * weight}
    ];

    const pop_day_data = [
      { day: "월", value: parseInt(popData[0]["월요일_유동인구_수"]) },
      { day: "화", value: parseInt(popData[0]["화요일_유동인구_수"]) },
      { day: "수", value: parseInt(popData[0]["수요일_유동인구_수"]) },
      { day: "목", value: parseInt(popData[0]["목요일_유동인구_수"]) },
      { day: "금", value: parseInt(popData[0]["금요일_유동인구_수"]) },
      { day: "토", value: parseInt(popData[0]["토요일_유동인구_수"]) },
      { day: "일", value: parseInt(popData[0]["일요일_유동인구_수"]) }
    ];

    const rev_day_data = [
      { day: "월", value: parseInt(revData[0]["월요일_매출_금액"]) * weight},
      { day: "화", value: parseInt(revData[0]["화요일_매출_금액"]) * weight},
      { day: "수", value: parseInt(revData[0]["수요일_매출_금액"]) * weight},
      { day: "목", value: parseInt(revData[0]["목요일_매출_금액"]) * weight},
      { day: "금", value: parseInt(revData[0]["금요일_매출_금액"]) * weight},
      { day: "토", value: parseInt(revData[0]["토요일_매출_금액"]) * weight},
      { day: "일", value: parseInt(revData[0]["일요일_매출_금액"]) * weight}
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
        { name: "월요일" },
        { name: "화요일" },
        { name: "수요일" },
        { name: "목요일" },
        { name: "금요일" },
        { name: "토요일" },
        { name: "일요일" },
        { name: "유동인구" },
        { name: "매출" }
      ],
      links: [
        { source: 13, target: 0, value: pop_time_data[0].value },
        { source: 13, target: 1, value: pop_time_data[1].value },
        { source: 13, target: 2, value: pop_time_data[2].value },
        { source: 13, target: 3, value: pop_time_data[3].value },
        { source: 13, target: 4, value: pop_time_data[4].value },
        { source: 13, target: 5, value: pop_time_data[5].value },
        { source: 13, target: 6, value: pop_day_data[0].value },
        { source: 13, target: 7, value: pop_day_data[1].value },
        { source: 13, target: 8, value: pop_day_data[2].value },
        { source: 13, target: 9, value: pop_day_data[3].value },
        { source: 13, target: 10, value: pop_day_data[4].value },
        { source: 13, target: 11, value: pop_day_data[5].value },
        { source: 13, target: 12, value: pop_day_data[6].value },
        { source: 0, target: 14, value: rev_time_data[0].value },
        { source: 1, target: 14, value: rev_time_data[1].value },
        { source: 2, target: 14, value: rev_time_data[2].value },
        { source: 3, target: 14, value: rev_time_data[3].value },
        { source: 4, target: 14, value: rev_time_data[4].value },
        { source: 5, target: 14, value: rev_time_data[5].value },
        { source: 6, target: 14, value: rev_day_data[0].value },
        { source: 7, target: 14, value: rev_day_data[1].value },
        { source: 8, target: 14, value: rev_day_data[2].value },
        { source: 9, target: 14, value: rev_day_data[3].value },
        { source: 10, target: 14, value: rev_day_data[4].value },
        { source: 11, target: 14, value: rev_day_data[5].value },
        { source: 12, target: 14, value: rev_day_data[6].value }
      ]
    };

    const width = 600;
    const height = 380;
    const offset = 25;

    // Create the SVG container
    const svg = d3.select("#sankey-chart")
      .append("svg")
      .attr("width", width + offset)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${offset},0)`);

    // Define the Sankey diagram properties
    const sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    const { nodes, links } = sankey({
      nodes: data.nodes.map(d => Object.assign({}, d)),
      links: data.links.map(d => Object.assign({}, d))
    });

    // Manually set node positions
    nodes.forEach(node => {
      if (node.name === "유동인구") {
        node.x0 = 0;
        node.x1 = 15;
      } else if (node.name === "매출") {
        node.x0 = width - 15;
        node.x1 = width;
      } else if (node.name.includes("요일") || node.name.includes("~")) {
        node.x0 = (width - 15) / 2;
        node.x1 = (width + 15) / 2;
      }
    });

    // Create the Sankey links
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", d => Math.max(1, d.width));

    // Create the Sankey nodes
    const node = g.append("g")
      .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => {
        if (d.name === "유동인구") return "blue";
        if (d.name === "매출") return "red";
        return "green";
      })
      .append("title")
      .text(d => `${d.name}\n${d.value}`);

    // Add text labels to the nodes  
    g.append("g")
      .style("font", "10px sans-serif")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => (d.x0 < width / 2 ? "start" : "end"))
      .text(d => d.name);
  });
}

function getVisualization(marker, checker) {
  // Remove all existing elements
  d3.select("#time-graph").selectAll("*").remove();
  d3.select("#day-graph").selectAll("*").remove();
  d3.select("#sankey-chart").selectAll("*").remove();

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
    sankeyVis(marker, checker);
  } else if (checker === "pop_sankey") {
    time_popVis(marker, checker);
    day_popVis(marker, checker);
    sankeyVis(marker, checker);
  } else if (checker === "rev_sankey") {
    time_revVis(marker, checker);
    day_revVis(marker, checker);
    sankeyVis(marker, checker);
  } else if (checker === "all") {
    time_bothVis(marker, checker);
    day_bothVis(marker, checker);
    sankeyVis(marker, checker);
  }
}

d3.csv("./data/revenue_filtered.csv").then(function (data) {
  console.log(data);
});

d3.csv("./data/population_filtered.csv").then(function (data) {
  console.log(data);
});

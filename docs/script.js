// Adaptation from https://bl.ocks.org/ProQuestionAsker/8382f70af7f4a7355827c6dc4ee8817d

// Set the margins
var margin = {top: 40, right: 40, bottom: 40, left: 80},
  width = d3.select('.chart').node().getBoundingClientRect().width - margin.left - margin.right,
  height = 370 - margin.top - margin.bottom;


// Set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var xcircle =  function(d) { return x(+d.Vacancies); }
var ycircle = function(d) { return y(+d.Applications); }

// Set colours
var colour = d3.scaleOrdinal()
  .range(["#f7d345","#29B3C7"]);

// Create the svg canvas in the "graph" div
var svg = d3.select("#chart-municipis")
        .append("svg")
        .style("width", width + margin.left + margin.right + "px")
        .style("height", height + margin.top + margin.bottom + 30 +"px")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "graph-svg-background")
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg");

// Import the CSV data
d3.csv("d3municipis.csv", function(error, data) {
  if (error) throw error;

   // Format the data
  data.forEach(function(d) {
      d.Code = d.Code;
      d.Name = d.Name;
      d.Municipality = d.Municipality;
      d.Ownership = d.Ownership;
      d.Applications = +d.Applications;
      d.Vacancies = +d.Vacancies;
  });

  var nest = d3.nest()
	  .key(function(d){
	    return d.Municipality;
	  })
	  .entries(data)

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Vacancies; }));
  y.domain([0, d3.max(data, function(d) { return d.Applications; })]);

  // Set up the x axis
  var xaxis = svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .attr("class", "x axis")
       .attr("class", "axisBlue")
       .attr("stroke-dasharray", "1.5,1.5")
       .call(d3.axisBottom(x)
          .ticks([7.5])
          .tickSize(0, 0)
          .tickSizeInner(0)
          .tickPadding(6));

  // Add a label to the x axis
  svg.append("text")
        .attr("transform",
        "translate(" + (width/2) + " ," +
                      (height + 30) + ")")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Initial vacancies")
        .attr("class", "x axis label")
        .style("fill", "#bad0d1");

  // Add the Y Axis
   var yaxis = svg.append("g")
       .attr("class", "y axis")
       .attr("class", "axisBlue")
       .attr("stroke-dasharray", "1.5,1.5")
       .call(d3.axisLeft(y)
          .ticks(5)
          .tickSizeInner(0)
          .tickPadding(6)
          .tickSize(0, 0));

  // Add a label to the y axis
  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Applications")
        .style("fill", "#bad0d1")
        .attr("class", "y axis label");

  // Add 1:1 line
  svg.append("line")          // attach a line
    .style("stroke", "#bad0d1")  // colour the line
    .attr("x1", x(0))     // x position of the first end of the line
    .attr("y1", y(0))      // y position of the first end of the line
    .attr("x2", x(140))     // x position of the second end of the line
    .attr("y2", y(140));

  // Add line annotation
  svg.append("text")
    .text("Demand=Supply")
    .attr("class", "annotation")
    .attr("x", x(130))
    .attr("y", y(145));

  // Add topleft annotation
  svg.append("text")
    .text("Oversubscription")
    .attr("class", "annotation")
    .attr("x", x(25))
    .attr("y", y(115));

  // Add bottomright annotation
  svg.append("text")
    .text("Poor demand")
    .attr("class", "annotation")
    .attr("x", x(125))
    .attr("y", y(35));

  // Create a dropdown
    var municipisMenu = d3.select("#municipisDropdown")

    municipisMenu
		.append("select")
		.selectAll("option")
        .data(nest)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d.key;
        })
        .text(function(d){
            return d.key;
        })

 	// Function to create the initial graph
 	var initialGraph = function(municipi){

 		// Filter the data to include only fruit of interest
 		var selectMunicipi = nest.filter(function(d){
                return d.key == municipi;
              })

    var selectMunicipiGroups = svg.selectAll(".municipiGroups")
	    .data(selectMunicipi, function(d){
	      return d ? d.key : this.key;
	    })
	    .enter()
	    .append("g")
	    .attr("class", "municipiGroups")
      .selectAll(".dot")
      .data(function(d) { return d.values; })
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xcircle)
      .attr("cy", ycircle)
      .style("fill", function(d) { return colour(d.Ownership); })
      .style("opacity", function(d, i) { if (i < 20)
         { return 1; } else { return 0.6; }
      });
		
	legendValues = d3.set(data.map( function(d) { return d.Ownership } ) ).values()

      var legend = d3.select(".legend")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr("class", "legend-flex")
                .selectAll(".legends")
                .data(legendValues)
                .enter()
                .append("rect")
                .attr("class", "legends")
                .style("background-color", function (d) { return colour(d) })
                .append('text')
                .text(function (d, i) { return d })
                .attr("class", "legend-text")		

}
 	// Create initial graph
 	initialGraph("Abrera")

 	// Update the data
 	var updateGraph = function(municipi){

 		// Filter the data to include only fruit of interest
 		var selectMunicipi = nest.filter(function(d){
                return d.key == municipi;
              })

 		// Select all of the grouped elements and update the data
	    var selectMunicipiGroups = svg.selectAll(".municipiGroups")
		    .data(selectMunicipi)

		    // Select all the lines and transition to new positions
          var dots =  selectMunicipiGroups.selectAll(".dot")
              .data(function(d){
                  return (d.values);
                })

          dots
              .exit()
              .transition()
                .duration(1000)
              .attr('r', 0)
              .remove();

          var new_dots = dots
              .enter()
              .append("circle")
              .attr("class", "dot")

          new_dots.merge(dots)
              .transition()
                .duration(400)
              .attr("r", 0)
              .transition()
                .duration(1)
              .attr("cx", xcircle)
              .attr("cy", ycircle)
              .style("fill", function(d) { return colour(d.Ownership); })
              .style("opacity", function(d, i) { if (i < 20)
                 { return 1; } else { return 0.6; }
              })
              .transition()
                .duration(600)
              .attr("r", 3.5)

 	}

 	// Run update function when dropdown selection changes
 	municipisMenu.on('change', function(){

 		// Find which fruit was selected from the dropdown
 		var selectedMunicipi = d3.select(this)
            .select("select")
            .property("value")

        // Run update function with the selected fruit
        updateGraph(selectedMunicipi)
    });
});

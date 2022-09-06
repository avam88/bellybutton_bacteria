function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    console.log(data);
    var sampleBacteria = data.samples;
    var washMeta = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleId = sampleBacteria.filter(sampleObj => sampleObj.id === sample);
    var wash = washMeta.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var bacteriaId = sampleId[0];
    var washId = wash[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    //var bacteria_info = Object.entries(bacteria_id).forEach(([key,value]) => {
    var OtuId = bacteriaId.otu_ids;
    var OtuLabels = bacteriaId.otu_labels;
    var OtuValues = bacteriaId.sample_values;
    var washCount = washId.wfreq;
    console.log(OtuId);
    console.log(OtuLabels);
    console.log(OtuValues);
    console.log(washCount);


    //})

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks = bacteriaOtuId.slice(0,10).sort((a,b) => a - b).reverse();
    var yticks = OtuId.slice(0,10).map(function(sample){
      return `OTU ${sample}`;
    }).reverse()
    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: OtuValues.slice(0,10).reverse(),
      //text: OtuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Culture Found",
      margin: {t: 30, l: 150}, 
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    var bubbleData = [{
      x: OtuId,
      y: OtuValues,
      text: OtuLabels,
      mode: "markers",
      marker: {
        size: OtuValues,
        color: OtuId,
        colorscale: "Earth"
      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      margin: {t: 30},

      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var gaugeData = [{
      domain: {x: [], y:[]},
      value: washCount,
      title: {text: "Belly Button Washing Frequency"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: { color: "black" },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ]
      }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600,
      height: 500,
      margin: {t:0, b:0}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  
  });
};  

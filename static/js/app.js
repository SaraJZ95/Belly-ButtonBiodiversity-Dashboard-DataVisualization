// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(samples => samples.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let i=0;i,keys.length;i++){
      let key = keys[i];  
      let value = result[key];
      PANEL.append("div")  
      .attr("class", "metadata-item")  
      .text(`${key.toUpperCase()}: ${value}`); 

    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleData = samples.filter(object => object.id == sample)[0];  // Use [0] to access the first (and only) result

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleData.otu_ids;         
    let otuLabels = sampleData.otu_labels;  
    let sampleValues = sampleData.sample_values; 

    // Build a Bubble Chart
    let trace1 = {
      x: otuIds,  
      y: sampleValues,  
      text: otuLabels,  
      mode: "markers",  
      marker: {
        size: sampleValues,  
        color: otuIds,  
        colorscale: "Earth"  
      }
    };
    
    let layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "Number of Bacteria" }, 
      yaxis: { title: "OTU ID" }, 
      hovermode: "closest"  
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [trace1], layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let topOtuIds = otuIds.slice(0, 10).reverse();
    let topOtuLabels = otuLabels.slice(0, 10).reverse();
    let topSampleValues = sampleValues.slice(0, 10).reverse();
    let yticks = topOtuIds.map(otuId => `OTU ${otuId}`);

    // Build a Bar Chart
    let trace2 = {
      x: topSampleValues,  
      y: yticks,  
      text: topOtuLabels,  
      type: "bar",  
      orientation: "h"  
    };
    
    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria"  
      },
      margin: { t: 30, l: 150 }  
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace2], layout2);
    
  });
} 

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").attr("value", sample).text(sample);
    });


    // Get the first sample from the list
    let firstSample = sampleNames[0];


    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);  
  buildMetadata(newSample); 

}

// Initialize the dashboard
init();

// Pull in the Data From samples.json File
function unpack() {d3.json('../../samples.json').then((data)=> {
    //Check to Make Sure that the Data Got Ported
    console.log(data)

    //Unpack the Values
    var names = data.names;
    var age = data.metadata.map(row=>row['age']);
    var bbtype = data.metadata.map(row=>row['bbtype']);
    var ethnicity = data.metadata.map(row=>row['ethnicity']);
    var gender = data.metadata.map(row=>row['gender']);
    var id = data.metadata.map(row=>row['id']);
    var location = data.metadata.map(row=>row['location']);
    var wfreq = data.metadata.map(row=>row['wfreq']);
    var s_id = data.samples.map(row=>row['id']);
    var otu_ids = data.samples.map(row=>row['otu_ids']);
    var otu_labels = data.samples.map(row=>row['otu_labels']);
    var sample_values = data.samples.map(row=>row['sample_values']);

    //Check to Make Sure that Values Got Unpacked
    console.log(`The person's name is: ${names}.`)
    console.log(`The person's age is: ${age}.`);
    console.log(`The person's belly button type is: ${bbtype}.`);
    console.log(`The person's ethnicity is: ${ethnicity}.`);
    console.log(`The person's gender is: ${gender}.`);
    console.log(`The person's ID number is: ${id}.`);
    console.log(`The person's location is: ${location}.`);
    console.log(`The person's w frequency is: ${wfreq}.`);
    console.log(`The sample IDs are: ${s_id}.`);
    console.log(`The sample OTU IDs are: ${otu_ids}.`);
    console.log(`The sample OTU labels are: ${otu_labels}.`);
    console.log(`The sample values are: ${sample_values}.`);
}
)};

unpack();



//Create the Charts
function init() {d3.json('../../samples.json').then((data)=> {
    //Unpack the Values
    var names = data.names;
    var age = data.metadata.map(row=>row['age']);
    var bbtype = data.metadata.map(row=>row['bbtype']);
    var ethnicity = data.metadata.map(row=>row['ethnicity']);
    var gender = data.metadata.map(row=>row['gender']);
    var id = data.metadata.map(row=>row['id']);
    var location = data.metadata.map(row=>row['location']);
    var wfreq = data.metadata.map(row=>row['wfreq']);
    var s_id = data.samples.map(row=>row['id']);
    var otu_ids = data.samples.map(row=>row['otu_ids']);
    var otu_labels = data.samples.map(row=>row['otu_labels']);
    var sample_values = data.samples.map(row=>row['sample_values']);

    //Sort the Values by sample_values
    var sorted = data.samples.sort((a, b) => b['sample_values']-a['sample_values']);

    //Return the Slices of Top 10 sample_values and their Corresponding otu_ids
    var sample_values_top10 = sorted.map(row=>row['sample_values'].slice(0,10));
    var otu_ids_top10 = sorted.map(row=>row['otu_ids'].slice(0,10).map((element)=>`OTU ${element}`));
    var otu_ids_top10_1 = sorted.map(row=>row['otu_ids'].slice(0,10));
    var otu_labels_top10 = sorted.map(row=>row['otu_labels'].slice(0,10));
    console.log(sample_values_top10);
    console.log(otu_ids_top10);

    //Create the Traces
    //Method to Add Hover Text Found at https://plotly.com/javascript/hover-text-and-formatting/
    //Bar
    trace_bar = {
        type: 'bar',
        orientation: 'h',
        x: sample_values_top10[0].reverse(),
        y: otu_ids_top10[0].reverse(),
        color: 'blue',
        mode: 'markers',
        marker: {size:16},
        text: otu_labels_top10[0]
    };

    //Method to Make Bubble Chart Trace found at https://plotly.com/javascript/bubble-charts/
    var size = sample_values_top10[0];
    var desired_maximum_marker_size = 1;
    trace_bubble = {
        mode: 'markers',
        x: otu_ids_top10_1[0],
        y: sample_values_top10[0],
        text: otu_labels_top10,
        marker: {
            color: otu_ids_top10_1[0],
            size: size,
            sizeref: 4.0 * Math.max(size) / (desired_maximum_marker_size**2),
            sizemode: 'area'
        }
    };
    //Put the Trace in a Data Array
    data_bar = [trace_bar];
    data_bubble = [trace_bubble];
    range = (0, Math.max(sample_values_top10[0]))+20;

    //Create the Layout
    layout_bar = {
        title: "Sample Values vs OTU IDs",
        xaxis: {title: "Sample Values"},
        yaxis: {title: "OTU IDs"}
    };
    layout_bubble = {
        title: "Sample Values vs OTU IDs",
        xaxis: {title: "OTU IDs"},
        yaxis: {title: "Sample Values", range: range}
    };
    //Show the Charts
    Plotly.newPlot('bar', data_bar, layout_bar);
    Plotly.newPlot('bubble', data_bubble, layout_bubble)
}
)};

init();

//Create the Loop to Append the Names to the Dropdown Menu
for (i=0; i<sample_values.length; i++) {
    d3.select("#selDataset").push(names[i]);
}

//Create the Loop to Go Through Each Row
for (i=0; i<sample_values.length; i++) {
    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);

    // This function is called when a dropdown menu item is selected
    function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");

    // Initialize x and y arrays
    var x = [];
    var y = [];

    if (dataset === names[i]) {
        x = sample_values[i];
        y = otu_ids[i];
    }

    // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("plot", "x", [x]);
    Plotly.restyle("plot", "y", [y]);
    }
};
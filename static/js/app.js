// Pull in the Data From samples.json File
function update() {d3.json('../../samples.json').then((data)=> {
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

    //Sort the Values by sample_values
    var sorted = data.samples.sort((a, b) => b['sample_values']-a['sample_values']);

    //Return the Slices of Top 10 sample_values and their Corresponding otu_ids
    var sample_values_top10 = sorted.map(row=>row['sample_values'].slice(0,10));
    var otu_ids_top10 = sorted.map(row=>row['otu_ids'].slice(0,10).map((element)=>`OTU ${element}`));
    var otu_ids_top10_1 = sorted.map(row=>row['otu_ids'].slice(0,10));
    var otu_labels_top10 = sorted.map(row=>row['otu_labels'].slice(0,10));
    console.log(sample_values_top10);
    console.log(otu_ids_top10);

    //Put the Initial Values in the Demographic Panel
    d3.select('.panel-body').append('p').html(`id: ${id[0]}`);
    d3.select('.panel-body').append('p').html(`ethnicity: ${ethnicity[0]}`);
    d3.select('.panel-body').append('p').html(`gender: ${gender[0]}`);
    d3.select('.panel-body').append('p').html(`age: ${age[0]}`);
    d3.select('.panel-body').append('p').html(`location: ${location[0]}`);
    d3.select('.panel-body').append('p').html(`bbtype: ${bbtype[0]}`);
    d3.select('.panel-body').append('p').html(`wfreq: ${wfreq[0]}`);

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
    //Learned more about SizeRef at https://github.com/plotly/documentation/issues/776
    //Learned more about ColorScale at https://stackoverflow.com/questions/46648135/colorscale-mismatches-colors-in-plotly-python
    var size = sample_values[0];
    trace_bubble = {
        mode: 'markers',
        x: otu_ids[0],
        y: sample_values[0],
        text: otu_labels[0],
        marker: {
            color: otu_ids[0],
            colorscale: [[0, 'blue'], [0.2, 'cyan'], [0.4, 'green'], [0.6, 'yellow'], [0.8, 'orange'], [1,'red']],
            size: size,
            sizeref: 2,
            sizemode: 'diameter',
            showscale: true
        }
    };
    //Put the Trace in a Data Array
    data_bar = [trace_bar];
    data_bubble = [trace_bubble];

    //Create the Layout
    layout_bar = {
        title: "Sample Values vs OTU IDs",
        xaxis: {title: "Sample Values"},
        yaxis: {title: "OTU IDs"}
    };
    layout_bubble = {
        title: "Sample Values vs OTU IDs",
        xaxis: {title: "OTU IDs"},
        yaxis: {title: "Sample Values"}
    };
    //Show the Charts
    Plotly.newPlot('bar', data_bar, layout_bar);
    Plotly.newPlot('bubble', data_bubble, layout_bubble)

    //Create the Loop to Append the IDs to the Dropdown Menu
    for (i=0; i<id.length; i++) {
        var option = d3.select("#selDataset").append('option');
        option.attr('value', id[i]);
        option.html(id[i]);
    };
    
    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);

    // This function is called when a dropdown menu item is selected
    function updatePlotly() {
        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.property("value");
        
        //Update the Panel
        //Remove Existing Values from the Demographic Panel
        d3.select('.panel-body').selectAll('p').remove()
        //Create the Loop to Apply the Update Panel Code for All Options
        for (i=0; i<id.length; i++) {
            
            if (dataset === String(id[i])) {
                console.log(`The chosen id is: ${id[i]}`);
                //Push the New Values in the Demographic Panel
                d3.select('.panel-body').append('p').html(`id: ${id[i]}`);
                d3.select('.panel-body').append('p').html(`ethnicity: ${ethnicity[i]}`);
                d3.select('.panel-body').append('p').html(`gender: ${gender[i]}`);
                d3.select('.panel-body').append('p').html(`age: ${age[i]}`);
                d3.select('.panel-body').append('p').html(`location: ${location[i]}`);
                d3.select('.panel-body').append('p').html(`bbtype: ${bbtype[i]}`);
                d3.select('.panel-body').append('p').html(`wfreq: ${wfreq[i]}`);
            }
        };

        // Initialize x and y arrays
        var x1 = [];
        var y1 = [];
        var x2 = [];
        var y2 = [];

            //Create the Loop to Go Through Each Row
        for (i=0; i<names.length; i++) {

            if (dataset === names[i]) {
                x1 = sample_values_top10[i].reverse();
                y1 = otu_ids_top10[i].reverse();
                x2 = otu_ids[i];
                y2 = sample_values[i];
                update = {marker: {
                    size: sample_values[i],
                    color: otu_ids[i]}
                };
            };

        // Note the extra brackets around 'x' and 'y'
        Plotly.restyle("bar", "x", [x1]);
        Plotly.restyle("bar", "y", [y1]);
        Plotly.restyle("bubble", "x", [x2]);
        Plotly.restyle("bubble", "y", [y2]);
        Plotly.restyle("bubble", "update", 1);
        };
    };
}
)};

update();
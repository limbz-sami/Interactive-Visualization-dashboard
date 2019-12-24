//getting demographic information from metaData

function buildDemography(sample) {
    d3.json("../samples.json").then((importdata) => {
        var data = importdata;
        console.log(data);
        //getting all the data from json file
        var metaData = data.metadata;
        //console.log(metaData[0]['id'])
        metaData.forEach(row => {
            if (+row.id === +sample) {
                var demographics = d3.select("#sample-metadata");
                demographics.html("");
                demographics.append('h5').html(`id:${row.id}`);
                demographics.append('h5').html(`ethnicity:${row.ethnicity}`);
                demographics.append('h5').html(`gender:${row.gender}`)
                demographics.append('h5').html(`age:${row.age}`)
                demographics.append('h5').html(`location:${row.location}`)
                demographics.append('h5').html(`bbtype:${row.bbtype}`)
                demographics.append('h5').html(`wfreq:${row.wfreq}`)
            };
        });
    })
};


//building the horizontal bargraph and bubble graph
function buildCharts(sample) {
    d3.json("../samples.json").then((importdata) => {
        var sample_data = importdata.samples;
        console.log(sample_data)

        sample_data.forEach(row => {
            if (+row.id === +sample) {

                var sample_value = row.sample_values
                var otu_id = row.otu_ids
                var otu_label = row.otu_labels


                var trace1 = {
                    type: 'bar',
                    x: (sample_value.slice(0, 10)).reverse(),
                    y: (otu_id.slice(0, 10)).reverse(),
                    hovertext: (otu_label.slice(0, 10)).reverse(),
                    hoverinfo: "text",
                    orientation: "h"
                };

                var chartdata1 = [trace1];

                var layout1 = {
                    yaxis: { type: 'category' },
                    title: "Top 10 Otu for each individual",
                    barmode: "stack"
                }

                var bar = document.getElementById('bar');
                Plotly.newPlot("bar", chartdata1, layout1)

                var trace2 = {
                    x: otu_id,
                    y: sample_value,
                    mode: "markers",
                    text: otu_label,
                    marker: {
                        size: sample_value,
                        color: otu_id,
                    }

                }

                var layout2 = {
                    title: "otu_id vs sample values(bubble chart)",
                    height: 500,
                    width: 1200
                };

                var chartdata2 = [trace2]

                var BUBBLE = document.getElementById('bubble');
                Plotly.newPlot("bubble", chartdata2, layout2)

            };
        }
        )
    }
    )
}


function init() {
    var select_option = d3.select("#selDataset");

    d3.json("../samples.json").then((importdata) => {
        var id = importdata.names;
        //console.log(id[0])
        id.forEach((sample) => {
            select_option.append('option').text(sample).property("value", sample);
        });

        var first_id = id[0];
        buildCharts(first_id);
        buildDemography(first_id);

    });
}

d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {
    var select_option = d3.select("#selDataset").property("value");
    console.log(select_option)

    buildCharts(select_option);
    buildDemography(select_option);
}


init();
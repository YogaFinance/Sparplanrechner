var myChart = document.getElementById('myChart').getContext('2d');

// Global options
Chart.defaults.global.defaultFontFamily = 'Helvetica';
// Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = 'black';

var navChart = new Chart(myChart, {
    type:'bar',
    data:{
        labels: [0,1,2,3,4,5,6,7,8,9,10,11,12],
        datasets: [{
            label: "Investitionen",
            data: [0,100,200,300,400,500,600,700,800,900,1000,1100,1200],
            backgroundColor: 'green',
        },  
        {
            label: "Zinsen",
            data: [0,0,0.8,2.4,4.81,8.04,12.09,16.97,22.69,29.25,36.66,44.92,54.05],
            backgroundColor: 'blue',
        }]
    },
    options:{
        title:{
            display: false,
            text: 'Sparplanrechner',
            fontSize: 25
        },
        legend:{
            position: 'bottom',
            // labels: {
            //     fontColor: 'red'
            // }
        },
        scales: {
            xAxes: [{
                stacked: true,
            }],
            yAxes: [{
                stacked: true,
            }]
        },
        tooltips: {
            mode: 'label',
            callbacks: {
                label: function(tooltipItem, data) {
                    var corporation = data.datasets[tooltipItem.datasetIndex].label;
                    var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            
                    // Loop through all datasets to get the actual total of the index
                    var total = 0;
                    for (var i = 0; i < data.datasets.length; i++)
                        total += data.datasets[i].data[tooltipItem.index];
            
                    // If it is not the last dataset, you display it as you usually do
                    if (tooltipItem.datasetIndex != data.datasets.length - 1) {
                        return corporation + " : $" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                    } else { // .. else, you display the dataset and the total, using an array
                        return [corporation + " : $" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), "Gesamt : $" + total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')];
                    }
               }
            }
        }
    }
});
// Utility function to handle CORS
const proxyUrl = 'https://api.allorigins.win/get?url=';

// API URLs
const urls = [
    'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson',
    'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson',
    'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=',
    'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id='
];

// Function to fetch data from API using proxy
async function fetchData(url) {
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        const data = await response.json();
        
        if (data.contents) {
            return JSON.parse(data.contents);
        } else {
            throw new Error('No valid JSON response');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data: ' + error.message);
        return null;
    }
}

// Function to process and display chart
async function loadChartData() {
    // Fetch data from multiple URLs
    const geojsonSemenanjung = await fetchData(urls[0]);
    const geojsonBorneo = await fetchData(urls[1]);
    const dashboardData = await fetchData(urls[2]);
    const trendData = await fetchData(urls[3]);

    if (!geojsonSemenanjung || !geojsonBorneo || !dashboardData || !trendData) {
        console.error('One or more data sources failed to load.');
        return;
    }

    // Process the data (this is an example, adjust according to the actual data structure)
    const labels = dashboardData.map(item => item.ppsbuka); // Replace with actual field
    const dataValues = dashboardData.map(item => item.someField); // Replace with actual field

    // Chart.js chart setup
    const ctx = document.getElementById('floodChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Flood Data Over Time',
                data: dataValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Flood Count'
                    },
                    min: 0
                }
            }
        }
    });
}

// Run the loadChartData function when the page is ready
window.onload = function() {
    loadChartData();
};

// Helper function to handle errors
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    alert(`Something went wrong in ${context}. Check the console for details.`);
}

// Function to fetch GeoJSON data
function fetchGeoJSON(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch from ${url}`);
            }
            return response.json();
        })
        .catch(error => handleError(error, 'fetchGeoJSON'));
}

// Function to render the chart
function renderChart(data) {
    if (!data) {
        handleError('Data is null or undefined', 'renderChart');
        return;
    }

    // Example: Rendering the Pie Chart
    const ctx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Flooding', 'Non-Flooding'],
            datasets: [{
                data: [65, 35],
                backgroundColor: ['#ff0000', '#00ff00'],
                borderColor: ['#ff0000', '#00ff00'],
                borderWidth: 1
            }]
        }
    });
}

// Function to load data
function loadData() {
    const geoJSONUrls = [
        'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson',
        'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson'
    ];

    Promise.all(geoJSONUrls.map(url => fetchGeoJSON(url)))
        .then(data => {
            if (data && data[0] && data[1]) {
                renderChart(data);
            } else {
                handleError('GeoJSON data is incomplete', 'loadData');
            }
        })
        .catch(error => handleError(error, 'loadData'));
}

// Initialize data loading
loadData();

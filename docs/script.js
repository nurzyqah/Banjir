// Global variables
const proxyUrl = 'https://api.allorigins.win/get?url=';
const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';

// Fetch the flood data (example with CORS bypass)
async function fetchFloodData(url) {
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        const data = await response.json();
        return data.contents ? JSON.parse(data.contents) : null;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Fetch the GeoJSON data for flood map
async function fetchGeoJsonData() {
    const geoJsonUrlSemenanjung = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson';
    const geoJsonUrlBorneo = 'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson';
    const [geoJsonSemenanjung, geoJsonBorneo] = await Promise.all([fetchFloodData(geoJsonUrlSemenanjung), fetchFloodData(geoJsonUrlBorneo)]);
    return { geoJsonSemenanjung, geoJsonBorneo };
}

// Load the map (Leaflet.js)
async function loadFloodMap() {
    const { geoJsonSemenanjung, geoJsonBorneo } = await fetchGeoJsonData();
    if (!geoJsonSemenanjung || !geoJsonBorneo) {
        console.error('GeoJSON data failed to load.');
        return;
    }

    // Initialize map with Leaflet.js
    const map = L.map('map').setView([4.2105, 101.9758], 6);  // Set to Malaysia's center

    // Add OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add GeoJSON layers for Semenanjung and Borneo
    L.geoJSON(geoJsonSemenanjung).addTo(map);
    L.geoJSON(geoJsonBorneo).addTo(map);
}

// Fetch and display pie chart (Chart.js)
async function loadPieChart() {
    const floodData = await fetchFloodData(apiUrl);
    if (!floodData) {
        console.error('Flood data failed to load for pie chart.');
        return;
    }

    // Example: Process data and generate pie chart
    const chartData = floodData.map(item => item.someField); // Replace with actual data field
    const labels = floodData.map(item => item.negeriName);  // Replace with actual field

    const pieChartData = {
        labels: labels,
        datasets: [{
            data: chartData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],  // Example colors
            hoverBackgroundColor: ['#FF4384', '#36A0EB', '#FFBC56', '#4BCC0C']
        }]
    };

    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: pieChartData
    });
}

// Fetch and display flow chart data (Chart.js)
async function loadFlowChartIn() {
    const floodData = await fetchFloodData(apiUrl);
    if (!floodData) {
        console.error('Flood data failed to load for flow chart.');
        return;
    }

    const chartData = floodData.map(item => item.someFieldIn);  // Replace with actual field
    const labels = floodData.map(item => item.date);  // Replace with actual field

    const ctx = document.getElementById('flowChartIn').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Aliran Mangsa Masuk',
                data: chartData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Tarikh' } },
                y: { title: { display: true, text: 'Jumlah Mangsa' }, min: 0 }
            }
        }
    });
}

// Fetch and display flow chart data (Chart.js)
async function loadFlowChartOut() {
    const floodData = await fetchFloodData(apiUrl);
    if (!floodData) {
        console.error('Flood data failed to load for flow chart.');
        return;
    }

    const chartData = floodData.map(item => item.someFieldOut);  // Replace with actual field
    const labels = floodData.map(item => item.date);  // Replace with actual field

    const ctx = document.getElementById('flowChartOut').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Aliran Mangsa Keluar',
                data: chartData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Tarikh' } },
                y: { title: { display: true, text: 'Jumlah Mangsa' }, min: 0 }
            }
        }
    });
}

// Initialize everything when the page loads
window.onload = async () => {
    loadFloodMap();  // Load the flood map
    loadPieChart();  // Load pie chart
    loadFlowChartIn();  // Load flow chart for incoming victims
    loadFlowChartOut();  // Load flow chart for outgoing victims
};

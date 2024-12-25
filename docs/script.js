// Include necessary libraries in your HTML file before this script
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.allorigins.win/get?url=' + 
        encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

    const tableContainer = document.getElementById('table-container');
    const floodPieChart = document.getElementById('floodPieChart');
    const categoryChart = document.getElementById('categoryChart');
    const flowChart = document.getElementById('flowChart');
    const flowChartIn = document.getElementById('flowChartIn');
    const flowChartOut = document.getElementById('flowChartOut');

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json();
        })
        .then(data => {
            try {
                const jsonData = JSON.parse(data.contents);
                displayData(jsonData);
                createCharts(jsonData);
            } catch (error) {
                console.error('Error parsing JSON data:', error);
                tableContainer.innerHTML = '<p style="color: red;">Failed to process data: ' + error.message + '</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            tableContainer.innerHTML = '<p style="color: red;">Failed to load data: ' + error.message + '</p>';
        });

    loadMap();

    // Function to display data in a table
    function displayData(data) {
        if (!data || !data.ppsbuka || data.ppsbuka.length === 0) {
            tableContainer.innerHTML = '<p>No data available.</p>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                        <th>District</th>
                        <th>Victims</th>
                        <th>Families</th>
                        <th>Capacity</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.ppsbuka.forEach(item => {
            tableHTML += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${item.negeri}</td>
                    <td>${item.daerah}</td>
                    <td>${item.mangsa}</td>
                    <td>${item.keluarga}</td>
                    <td>${item.kapasiti}</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        tableContainer.innerHTML = tableHTML;
    }

    // Function to create charts using Chart.js
    function createCharts(data) {
        const victimCounts = data.ppsbuka.map(item => item.mangsa);
        const familyCounts = data.ppsbuka.map(item => item.keluarga);
        const capacityCounts = data.ppsbuka.map(item => item.kapasiti);
        const labels = data.ppsbuka.map(item => item.nama);

        // Pie chart for victims
        new Chart(floodPieChart.getContext('2d'), {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: victimCounts,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                }],
            },
        });

        // Bar chart for families
        new Chart(categoryChart.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Families',
                    data: familyCounts,
                    backgroundColor: '#36A2EB',
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        });
    }

    // Function to load the map
    function loadMap() {
        const map = L.map('map').setView([4.2105, 101.9758], 6); // Centered on Malaysia
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const geojsonUrl = 'https://your-working-geojson-url.geojson'; // Replace with your GeoJSON URL
        fetch(geojsonUrl)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data).addTo(map);
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
            });
    }
});

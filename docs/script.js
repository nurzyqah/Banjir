// API URLs
const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');
const aliranJumMangsaUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranMasukUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranKeluarUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.json())  // Ensure the response is treated as JSON
        .then(data => {
            console.log('Raw API data:', data);  // Log the raw data for debugging
            if (data.contents) {
                try {
                    const jsonData = JSON.parse(data.contents);  // Parse the JSON string properly
                    displayData(jsonData);
                    displayPieChart(jsonData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    tableContainer.innerHTML = `<p style="color: red;">Error parsing JSON: ${error.message}</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error loading data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });

    loadMap();
    loadAliranJumMangsa(); // Load Aliran Jum Mangsa data
    loadAliranMasuk(); // Load Aliran Mangsa Masuk data
    loadAliranKeluar(); // Load Aliran Mangsa Keluar data
    loadBarChart(); // Load bar chart data
});

// Load the Aliran Jum Mangsa data
function loadAliranJumMangsa() {
    fetch(aliranJumMangsaUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Jum Mangsa Data:', data);
            if (data && data.points) {
                displayCategoryChart(data, 'Aliran Jum Mangsa', 'categoryChart1');
            }
        })
        .catch(error => {
            console.error('Error loading Aliran Jum Mangsa data:', error.message);
        });
}

// Load Aliran Masuk data
function loadAliranMasuk() {
    fetch(aliranMasukUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Masuk Data:', data);
            if (data && data.points) {
                displayCategoryChart(data, 'Aliran Mangsa Masuk', 'categoryChart2');
            }
        })
        .catch(error => {
            console.error('Error loading Aliran Mangsa Masuk data:', error.message);
        });
}

// Load Aliran Keluar data
function loadAliranKeluar() {
    fetch(aliranKeluarUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Keluar Data:', data);
            if (data && data.points) {
                displayCategoryChart(data, 'Aliran Mangsa Keluar', 'categoryChart3');
            }
        })
        .catch(error => {
            console.error('Error loading Aliran Mangsa Keluar data:', error.message);
        });
}

// Load Bar Chart data
function loadBarChart() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Bar Chart Data:', data);
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);

                // Prepare data for bar chart
                const labels = jsonData.points.map(item => item.negeri || 'Unknown');
                const values = jsonData.points.map(item => parseInt(item.mangsa, 10) || 0);

                // Display the bar chart
                const ctx = document.getElementById('barChart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Jumlah Mangsa',
                            data: values,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading bar chart data:', error.message);
        });
}

// Display Category Chart
function displayCategoryChart(data, chartTitle, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const labels = data.points.map(item => item.date); // Assuming date field is available
    const values = data.points.map(item => item.value); // Adjust this depending on your response

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: chartTitle,
                data: values,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Display Data in Table
function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    console.log('Displaying data:', data);

    if (!data || !data.points || data.points.length === 0) {
        tableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    let tableHTML = `
    <table class="formal-table">
        <thead>
            <tr>
                <th>Nama PPS</th>
                <th>Negeri</th>
                <th>Daerah</th>
                <th>Bencana</th>
                <th>Mangsa</th>
                <th>Keluarga</th>
                <th>Kapasiti</th>
            </tr>
        </thead>
    <tbody>`;

    data.points.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.name || 'N/A'}</td>
                <td>${item.negeri || 'N/A'}</td>
                <td>${item.daerah || 'N/A'}</td>
                <td>${item.bencana || 'N/A'}</td>
                <td>${item.mangsa || 'N/A'}</td>
                <td>${item.keluarga || 'N/A'}</td>
                <td>${item.kapasiti || 'N/A'}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
}

// Load the Map (Placeholder)
function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
}

// Display Pie Chart
function displayPieChart(data) {
    if (!data || !data.points) {
        console.warn('No data available for pie chart');
        return;
    }

    const totalMangsa = data.points.reduce((acc, item) => acc + parseInt(item.mangsa, 10), 0);
    const totalKeluarga = data.points.reduce((acc, item) => acc + parseInt(item.keluarga, 10), 0);

    const ctx = document.getElementById('floodPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Mangsa', 'Keluarga'],
            datasets: [{
                data: [totalMangsa, totalKeluarga],
                backgroundColor: ['#FF6384', '#36A2EB']
            }]
        },
        options: {
            responsive: false, // Disable responsive behavior
            maintainAspectRatio: false, // Allow custom aspect ratio
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

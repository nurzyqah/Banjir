// API URLs
const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');
const aliranJumMangsaUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranMasukUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranKeluarUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id='');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    // Fetch main API data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Raw proxy data:', data);
            if (data && data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayData(jsonData);
                displayPieChart(jsonData);
            } else {
                throw new Error('Empty or undefined contents from API');
            }
        })
        .catch(error => {
            console.error('Error loading data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });

    // Load additional data
    loadMap();
    loadAliranJumMangsa();
    loadAliranMasuk();
    loadAliranKeluar();
    loadBarChart();
});

function loadAliranJumMangsa() {
    fetch(aliranJumMangsaUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Jum Mangsa Data:', data);
            if (data && data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Jum Mangsa', 'categoryChart1');
                loadBarChartForAliranJumMangsa(jsonData);
            } else {
                throw new Error('Empty or undefined contents for Aliran Jum Mangsa');
            }
        })
        .catch(error => {
            console.error('Error loading Aliran Jum Mangsa data:', error.message);
        });
}

function loadAliranMasuk() {
    fetch(aliranMasukUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Masuk Data:', data);
            if (data && data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Mangsa Masuk', 'categoryChart2');
                loadBarChartForAliranMasuk(jsonData);
            } else {
                throw new Error('Empty or undefined contents for Aliran Masuk');
            }
        })
        .catch(error => {
            console.error('Error loading Aliran Mangsa Masuk data:', error.message);
        });
}

function loadAliranKeluar() {
    fetch(aliranKeluarUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Keluar Data:', data);
            if (data && data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Mangsa Keluar', 'categoryChart3');
                loadBarChartForAliranKeluar(jsonData);
            } else {
                throw new Error('Empty or undefined contents for Aliran Keluar');
            }
        })
        .catch(error => {
            console.error('Error loading Aliran Mangsa Keluar data:', error.message);
        });
}

function loadBarChart() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Bar Chart Data:', data);
            if (data && data.contents) {
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
            } else {
                throw new Error('Empty or undefined contents for Bar Chart');
            }
        })
        .catch(error => {
            console.error('Error loading bar chart data:', error.message);
        });
}

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
            </tr>`;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
}

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
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
}

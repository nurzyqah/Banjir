// API URLs
const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');
const aliranJumMangsaUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranMasukUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranKeluarUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayData(jsonData);
                displayPieChart(jsonData);
            } else {
                throw new Error('No contents in response');
            }
        })
        .catch(error => {
            console.error('Error loading data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });

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
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Jum Mangsa', 'categoryChart1');
            } else {
                throw new Error('No contents in response');
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
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Mangsa Masuk', 'categoryChart2');
            } else {
                throw new Error('No contents in response');
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
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Mangsa Keluar', 'categoryChart3');
            } else {
                throw new Error('No contents in response');
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
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                const labels = jsonData.points.map(item => item.negeri || 'Unknown');
                const values = jsonData.points.map(item => parseInt(item.mangsa, 10) || 0);

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
                throw new Error('No contents in response');
            }
        })
        .catch(error => {
            console.error('Error loading bar chart data:', error.message);
        });
}

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

function displayData(data) {
    const tableContainer = document.getElementById('table-container');

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

function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add more map features or data points as needed
}

function displayPieChart(data) {
    if (!data || !data.points) {
        console.warn('No data available for pie chart');
        return;
    }

    const totalMangsa = data.points.reduce((acc, item) => acc + parseInt(item.mangsa, 10), 0);
    const totalKeluarga = data.points.reduce((acc, item) => acc + parseInt(item.keluarga, 10), 0);

    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Total Mangsa', 'Total Keluarga'],
            datasets: [{
                data: [totalMangsa, totalKeluarga],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

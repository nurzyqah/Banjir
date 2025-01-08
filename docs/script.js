const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');
const aliranJumMangsaUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=';
const aliranMasukUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=';
const aliranKeluarUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=';

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    // Fetch data for the 4 APIs
    fetchData(apiUrl, 'pusatBuka');
    fetchData(aliranJumMangsaUrl, 'aliranJumlahMangsa');
    fetchData(aliranMasukUrl, 'aliranMasuk');
    fetchData(aliranKeluarUrl, 'aliranKeluar');

    loadMap();
});

// Function to fetch data from API and display it
function fetchData(url, type) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(`Raw proxy data (${type}):`, data);
            if (data.contents) {
                try {
                    const jsonData = JSON.parse(data.contents);
                    if (type === 'pusatBuka') {
                        displayData(jsonData);
                    } else if (type === 'aliranJumlahMangsa' || type === 'aliranMasuk' || type === 'aliranKeluar') {
                        displayTrendChart(jsonData, type);
                    }
                } catch (error) {
                    console.error(`Error processing data for ${type}:`, error.message);
                }
            } else {
                console.error(`No contents received from API for ${type}.`);
            }
        })
        .catch(error => {
            console.error(`Error loading data for ${type}:`, error.message);
        });
}

// Function to display data in a table (for 'pusatBuka')
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
            <tbody>
    `;

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

// Function to display trend charts for Aliran data
function displayTrendChart(data, chartType) {
    if (!data || !data.points) {
        console.warn(`No data available for ${chartType} trend chart`);
        return;
    }

    const labels = data.points.map(item => item.date);
    const values = data.points.map(item => parseInt(item.value, 10));

    const ctx = document.getElementById(`${chartType}-chart`).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Mangsa',
                data: values,
                fill: false,
                borderColor: '#FF6384',
                tension: 0.1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Function to load map
function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
}

// Function to display Pie Chart for ALIRAN JUMLAH MANGSA
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
            responsive: false,
            maintainAspectRatio: false,
            width: 250,
            height: 250,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

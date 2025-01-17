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
});

// Function to load and render Aliran Jum Mangsa
function loadAliranJumMangsa() {
    fetch(aliranJumMangsaUrl)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Jum Mangsa', 'categoryChart1');
            }
        })
        .catch(error => console.error('Error loading Aliran Jum Mangsa data:', error));
}

// Function to load and render Aliran Mangsa Masuk
function loadAliranMasuk() {
    fetch(aliranMasukUrl)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Mangsa Masuk', 'categoryChart2');
            }
        })
        .catch(error => console.error('Error loading Aliran Mangsa Masuk data:', error));
}

// Function to load and render Aliran Mangsa Keluar
function loadAliranKeluar() {
    fetch(aliranKeluarUrl)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                const jsonData = JSON.parse(data.contents);
                displayCategoryChart(jsonData, 'Aliran Mangsa Keluar', 'categoryChart3');
            }
        })
        .catch(error => console.error('Error loading Aliran Mangsa Keluar data:', error));
}

// Function to display line charts
function displayCategoryChart(data, chartTitle, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const labels = data.points.map(item => item.date || 'Unknown');
    const values = data.points.map(item => parseInt(item.value, 10) || 0);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: chartTitle,
                data: values,
                borderColor: chartId === 'categoryChart1' ? '#4285F4' :
                             chartId === 'categoryChart2' ? '#DB4437' : '#0F9D58',
                backgroundColor: chartId === 'categoryChart1' ? 'rgba(66, 133, 244, 0.2)' :
                                 chartId === 'categoryChart2' ? 'rgba(219, 68, 55, 0.2)' : 'rgba(15, 157, 88, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Date' }
                },
                y: {
                    title: { display: true, text: 'Count' },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: true, position: 'top' }
            }
        }
    });
}

// Function to display data table
function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    if (!data.points || data.points.length === 0) {
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

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Function to load map
function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
}

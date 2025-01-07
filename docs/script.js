const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const apiUrlAliranMangsa = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const apiUrlAliranMasuk = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const apiUrlAliranKeluar = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
    
    // Fetch data for PPS overview
    fetchData(apiUrl, displayData);

    // Fetch data for Aliran Mangsa
    fetchData(apiUrlAliranMangsa, (data) => displayFlowChart(data, 'flowChart', 'Jumlah Mangsa', 'mangsa'));

    // Fetch data for Aliran Mangsa Masuk
    fetchData(apiUrlAliranMasuk, (data) => displayFlowChart(data, 'flowChartIn', 'Mangsa Masuk', 'masuk'));

    // Fetch data for Aliran Mangsa Keluar
    fetchData(apiUrlAliranKeluar, (data) => displayFlowChart(data, 'flowChartOut', 'Mangsa Keluar', 'balik'));

    loadMap();
});

// Helper function to fetch data and handle errors
function fetchData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            try {
                const jsonData = JSON.parse(data.contents);
                callback(jsonData); // Call the provided callback function
            } catch (error) {
                console.error('Ralat dalam memproses data:', error.message);
                alert('Gagal untuk memproses data.');
            }
        })
        .catch(error => {
            console.error('Ralat memuatkan data:', error.message);
            alert('Gagal memuatkan data.');
        });
}

// Display data in the table for PPS overview
function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    if (!data.ppsbuka || data.ppsbuka.length === 0) {
        tableContainer.innerHTML = '<p>Tiada data yang tersedia.</p>';
        return;
    }

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nama PPS</th>
                    <th>Negeri</th>
                    <th>Daerah</th>
                    <th>Mangsa</th>
                    <th>Keluarga</th>
                    <th>Kapasiti</th>
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

// Load the map using Leaflet
function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const geojsonUrlSemenanjung = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson');
    const geojsonUrlBorneo = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson');

    fetch(geojsonUrlSemenanjung)
        .then(response => response.json())
        .then(data => {
            try {
                const jsonData = JSON.parse(data.contents);
                L.geoJSON(jsonData).addTo(map);
            } catch (error) {
                console.error('Ralat dalam memproses geojson Semenanjung:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan geojson Semenanjung:', error));

    fetch(geojsonUrlBorneo)
        .then(response => response.json())
        .then(data => {
            try {
                const jsonData = JSON.parse(data.contents);
                L.geoJSON(jsonData).addTo(map);
            } catch (error) {
                console.error('Ralat dalam memproses geojson Borneo:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan geojson Borneo:', error));
}

// Display flow chart (for total victims, incoming or outgoing victims)
function displayFlowChart(data, chartId, label, key) {
    const ctx = document.getElementById(chartId).getContext('2d');
    let labels = [];
    let values = [];

    if (data && data.tarikh && data[key]) {
        data.tarikh.forEach((date, index) => {
            labels.push(date);
            values.push(data[key][index] || 0);  // Default to 0 if no data for the key
        });

        const chartData = {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderColor: '#007bff',
                fill: false,
                tension: 0.1
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        labels: labels
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        console.warn('Tiada data untuk carta aliran');
    }
}

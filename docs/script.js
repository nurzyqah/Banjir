const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');
const aliranJumMangsaUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranMasukUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const aliranKeluarUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Raw proxy data:', data);
            if (data.contents) {
                console.log('Contents:', data.contents);
                try {
                    const jsonData = JSON.parse(data.contents);
                    displayData(jsonData);
                    displayPieChart(jsonData);
                } catch (error) {
                    console.error('Error processing data:', error.message);
                    tableContainer.innerHTML = `<p style="color: red;">Failed to process data: ${error.message}</p>`;
                }
            } else {
                console.error('No contents in response');
                tableContainer.innerHTML = `<p style="color: red;">Failed to process data: No contents received from API.</p>`;
            }
        })
        .catch(error => {
            console.error('Error loading data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });

    loadMap();
    loadAliranData(aliranJumMangsaUrl, 'Aliran Jum Mangsa', 'categoryChart1');
    loadAliranData(aliranMasukUrl, 'Aliran Mangsa Masuk', 'categoryChart2');
    loadAliranData(aliranKeluarUrl, 'Aliran Mangsa Keluar', 'categoryChart3');
});

function loadAliranData(url, chartTitle, chartId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(`${chartTitle} Data:`, data);
            if (data && data.points) {
                displayCategoryChart(data, chartTitle, chartId);
                if (chartTitle === 'Aliran Jum Mangsa') {
                    displayJumlahMangsa(data);
                }
            }
        })
        .catch(error => {
            console.error(`Error loading ${chartTitle} data:`, error.message);
        });
}

function displayCategoryChart(data, chartTitle, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    const labels = data.points.map(item => item.date);  // Assuming date field is available
    const values = data.points.map(item => item.value);  // Adjust this depending on your response

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

function displayJumlahMangsa(data) {
    const jumlahMangsaContainer = document.createElement('div');
    jumlahMangsaContainer.className = 'card-body';
    jumlahMangsaContainer.innerHTML = `
        <div class="echart-bounce-rate" data-bs-a="0" data-bs-b="0" data-bs-seasonmain-id="209" data-bs-seasonnegeri-id="" data-echart-responsive="true">
            <div style="position: relative; width:  589px; height: 320px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
                <canvas data-zr-dom-id="zr_0" width="736" height="400" style="position: absolute; left: 0px; top: 0px; width: 589px; height: 320px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
            </div>
            <div class="" style="position: absolute; display: block; border-style: solid; white-space: nowrap; z-index: 9999999; box-shadow: rgba(0, 0, 0, 0.2) 1px 2px 10px; background-color: rgb(249, 250, 253); border-width: 1px; border-radius: 4px; color: rgb(11, 23, 39); font: 14px / 21px 'Microsoft YaHei'; padding: 7px 10px; top: 0px; left: 0px; transform: translate3d(161px, -26px, 0px); border-color: rgb(216, 226, 239); pointer-events: none; visibility: hidden; opacity: 0;">
                <div>
                    <p class="mb-0 text-600">29, December</p>
                    <div class="d-flex align-items-center">
                        <p class="mb-0 text-600">
                            Jumlah Mangsa : <span class="text-800">${data.points.reduce((acc, item) => acc + parseInt(item.mangsa, 10), 0)}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('table-container').appendChild(jumlahMangsaContainer);
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
            responsive: false,  // Disable responsive behavior
            maintainAspectRatio: false,  // Allow custom aspect ratio
            width: 250,  // Set fixed width
            height: 250, // Set fixed height
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}
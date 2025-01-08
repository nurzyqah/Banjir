const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            console.log('Raw proxy data:', data);
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.contents) {
                    const parsedData = JSON.parse(jsonData.contents);
                    displayData(parsedData);
                    displayPieChart(parsedData);
                } else {
                    throw new Error('Struktur JSON tidak sah: kandungan hilang');
                }
            } catch (error) {
                console.error('Ralat dalam memproses data:', error.message);
                tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memproses data: ${error.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Ralat memuatkan data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memuatkan data: ${error.message}</p>`;
        });

    loadMap();
});

function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    console.log('Memaparkan data:', data);

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

function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const geojsonUrlSemenanjung = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson');
    const geojsonUrlBorneo = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson');

    fetch(geojsonUrlSemenanjung)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                L.geoJSON(JSON.parse(data.contents)).addTo(map);
            } else {
                console.error('Respons yang tidak sah untuk Semenanjung geojson:', data);
            }
        })
        .catch(error => console.error('Ralat memuatkan geojson Semenanjung:', error));

    fetch(geojsonUrlBorneo)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                L.geoJSON(JSON.parse(data.contents)).addTo(map);
            } else {
                console.error('Respons yang tidak sah untuk Borneo geojson:', data);
            }
        })
        .catch(error => console.error('Ralat memuatkan geojson Borneo:', error));
}

function displayPieChart(data) {
    const ctx = document.getElementById('floodPieChart').getContext('2d');

    let totalVictims = 0;
    let totalFamilies = 0;

    // Calculate totals
    if (data.ppsbuka && data.ppsbuka.length > 0) {
        data.ppsbuka.forEach(item => {
            totalVictims += parseInt(item.mangsa) || 0;
            totalFamilies += parseInt(item.keluarga) || 0;
        });
    } else {
        console.warn('Tiada data untuk carta pai');
        return;
    }

    // Chart data
    const pieData = {
        labels: ['Jumlah Mangsa', 'Jumlah Keluarga'],
        datasets: [{
            label: 'Bilangan',
            data: [totalVictims, totalFamilies],
            backgroundColor: ['#007bff', '#28a745'],
            hoverOffset: 4
        }]
    };

    // Create chart
    new Chart(ctx, {
        type: 'pie',
        data: pieData,
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function filterTable() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const tableRows = document.querySelectorAll('#table-container table tbody tr');

    if (!searchInput) {
        alert("Sila masukkan negeri atau daerah untuk carian.");
        return;
    }

    tableRows.forEach(row => {
        const negeri = row.cells[1].innerText.toLowerCase();
        const daerah = row.cells[2].innerText.toLowerCase();

        if (negeri.includes(searchInput) || daerah.includes(searchInput)) {
            row.style.display = ""; // Show matching rows
        } else {
            row.style.display = "none"; // Hide non-matching rows
        }
    });
}

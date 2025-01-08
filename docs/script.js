const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');

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
                    console.error('Ralat dalam memproses data:', error.message);
                    tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memproses data: ${error.message}</p>`;
                }
            } else {
                console.error('No contents in response');
                tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memproses data: No contents received from API.</p>`;
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

    if (!data || !data.ppsbuka || data.ppsbuka.length === 0) {
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
                <td>${item.nama || 'N/A'}</td>
                <td>${item.negeri || 'N/A'}</td>
                <td>${item.daerah || 'N/A'}</td>
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
    if (!data || !data.ppsbuka) {
        console.warn('No data available for pie chart');
        return;
    }

    const totalMangsa = data.ppsbuka.reduce((acc, item) => acc + parseInt(item.mangsa, 10), 0);
    const totalKeluarga = data.ppsbuka.reduce((acc, item) => acc + parseInt(item.keluarga, 10), 0);

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
            responsive: true
        }
    });
}

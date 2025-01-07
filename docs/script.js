const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const apiUrlAliranMangsa = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const apiUrlAliranMasuk = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');
const apiUrlAliranKeluar = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    // Fetch data for the table
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Raw proxy data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                displayData(jsonData);
                displayPieChart(jsonData);
                displayCategoryChart(jsonData);
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

    // Fetch and display the Aliran Jumlah Mangsa chart
    fetch(apiUrlAliranMangsa)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Aliran Jumlah Mangsa data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                console.log('Parsed Aliran Jumlah Mangsa data:', jsonData);
                displayFlowChart(jsonData, 'flowChart', 'Jumlah Mangsa', 'mangsa');
            } catch (error) {
                console.error('Ralat dalam memproses data Aliran Jumlah Mangsa:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan data Aliran Jumlah Mangsa:', error.message));

    // Fetch and display the Aliran Mangsa Masuk chart
    fetch(apiUrlAliranMasuk)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Aliran Mangsa Masuk data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                console.log('Parsed Aliran Mangsa Masuk data:', jsonData);
                displayFlowChart(jsonData, 'flowChartIn', 'Mangsa Masuk', 'masuk');
            } catch (error) {
                console.error('Ralat dalam memproses data Aliran Mangsa Masuk:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan data Aliran Mangsa Masuk:', error.message));

    // Fetch and display the Aliran Mangsa Keluar chart
    fetch(apiUrlAliranKeluar)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Aliran Mangsa Keluar data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                console.log('Parsed Aliran Mangsa Keluar data:', jsonData);
                displayFlowChart(jsonData, 'flowChartOut', 'Mangsa Keluar', 'balik');
            } catch (error) {
                console.error('Ralat dalam memproses data Aliran Mangsa Keluar:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan data Aliran Mangsa Keluar:', error.message));
});

function loadMap() {
    const map = L.map('map').setView([4.2105, 101.9758], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const geojsonUrlSemenanjung = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson');
    const geojsonUrlBorneo = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson');

    fetch(geojsonUrlSemenanjung)
        .then(response => response.text())
        .then(text => {
            try {
                const jsonData = JSON.parse(text);
                L.geoJSON(jsonData).addTo(map);
            } catch (error) {
                console.error('Ralat dalam memproses geojson Semenanjung:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan geojson Semenanjung:', error));

    fetch(geojsonUrlBorneo)
        .then(response => response.text())
        .then(text => {
            try {
                const jsonData = JSON.parse(text);
                L.geoJSON(jsonData).addTo(map);
            } catch (error) {
                console.error('Ralat dalam memproses geojson Borneo:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan geojson Borneo:', error));
}

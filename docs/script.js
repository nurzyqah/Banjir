const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

const apiUrlPusatBuka = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');
const apiUrlPieData = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-pie.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const apiUrlAliranMangsa = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const apiUrlAliranMasuk = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const apiUrlAliranKeluar = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Raw proxy data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                displayData(jsonData);
            } catch (error) {
                console.error('Ralat dalam memproses data:', error.message);
                tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memproses data: ${error.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Ralat memuatkan data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Gagal untuk memuatkan data: ${error.message}</p>`;
        });

    // Fetch pusat buka data
    fetch(apiUrlPusatBuka)
        .then(response => response.json())
        .then(data => {
            console.log('Pusat Buka data:', data);
            // Process and display pusat buka data as needed
        })
        .catch(error => console.error('Ralat memuatkan data pusat buka:', error.message));

    // Fetch and display the Pie Chart data
    fetch(apiUrlPieData)
        .then(response => response.json())
        .then(data => {
            console.log('Data Dashboard Pie:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                displayPieChart(jsonData);
            } catch (error) {
                console.error('Ralat dalam memproses data untuk carta pai:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan data untuk carta pai:', error.message));

    // Fetch and display the Aliran Jumlah Mangsa chart
    fetch(apiUrlAliranMangsa)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Jumlah Mangsa data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                displayFlowChart(jsonData, 'flowChart', 'Jumlah Mangsa', 'mangsa');
            } catch (error) {
                console.error('Ralat dalam memproses data Aliran Jumlah Mangsa:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan data Aliran Jumlah Mangsa:', error.message));

    // Fetch and display the Aliran Mangsa Masuk chart
    fetch(apiUrlAliranMasuk)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Mangsa Masuk data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                displayFlowChart(jsonData, 'flowChartIn', 'Mangsa Masuk', 'masuk');
            } catch (error) {
                console.error('Ralat dalam memproses data Aliran Mangsa Masuk:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan data Aliran Mangsa Masuk:', error.message));

    // Fetch and display the Aliran Mangsa Keluar chart
    fetch(apiUrlAliranKeluar)
        .then(response => response.json())
        .then(data => {
            console.log('Aliran Mangsa Keluar data:', data);
            try {
                const jsonData = JSON.parse(data.contents);
                displayFlowChart(jsonData, 'flowChartOut', 'Mangsa Keluar', 'balik');
            } catch (error) {
                console.error('Ralat dalam memproses data Aliran Mangsa Keluar:', error.message);
            }
        })
        .catch(error => console.error('Ralat memuatkan data Aliran Mangsa Keluar:', error.message));
});

// Existing functions for displayData, displayPieChart, and displayFlowChart remain unchanged
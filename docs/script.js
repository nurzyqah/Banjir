// New API URLs
const apiUrlPusatBuka = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0');
const apiUrlPieData = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-pie.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const apiUrlAliranMangsa = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const apiUrlAliranMasuk = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');
const apiUrlAliranKeluar = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id=');

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
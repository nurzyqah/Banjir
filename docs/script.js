const apiUrl = 'https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0';

async function fetchFloodData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.points && data.points.length > 0) {
            displayData(data.points);
        } else {
            displayNoDataMessage();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        displayErrorMessage();
    }
}

function displayData(points) {
    const dataContainer = document.getElementById('data');
    let output = '<ul>';

    points.forEach(point => {
        output += `
            <li>
                <strong>${point.name}</strong><br>
                Negeri: ${point.negeri}<br>
                Daerah: ${point.daerah}<br>
                Mukim: ${point.mukim}<br>
                Bencana: ${point.bencana}<br>
                Mangsa: ${point.mangsa}<br>
                Keluarga: ${point.keluarga}<br>
                Kapasiti: ${point.kapasiti}<br>
                Lokasi: ${point.latti}, ${point.longi}
            </li>
        `;
    });

    output += '</ul>';
    dataContainer.innerHTML = output;
}

function displayNoDataMessage() {
    const dataContainer = document.getElementById('data');
    dataContainer.innerHTML = 'Tiada data yang tersedia.';
}

function displayErrorMessage() {
    const dataContainer = document.getElementById('data');
    dataContainer.innerHTML = 'Ralat dalam mendapatkan data.';
}

// Call the function to fetch and display the data
fetchFloodData();

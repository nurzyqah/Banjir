const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');

    fetch(apiUrl)
        .then(response => response.text())  // Get raw response as text
        .then(data => {
            console.log('Raw proxy data:', data);  // Log the raw data to check for issues
            try {
                const jsonData = JSON.parse(data);  // Attempt to parse the response as JSON
                if (jsonData && jsonData.contents) {
                    const parsedData = JSON.parse(jsonData.contents);  // Parse the contents as JSON
                    displayData(parsedData);  // Pass the parsed data to displayData
                } else {
                    throw new Error('Invalid JSON structure: missing contents');
                }
            } catch (error) {
                console.error('Error parsing the data:', error.message);
                tableContainer.innerHTML = `<p style="color: red;">Failed to parse data: ${error.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            tableContainer.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });
});

function displayData(data) {
    const tableContainer = document.getElementById('table-container');
    console.log('Displaying data:', data);

    if (!data.ppsbuka || data.ppsbuka.length === 0) {
        tableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    let tableHTML = `
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>PPS Name</th>
                    <th>State</th>
                    <th>District</th>
                    <th>Victims</th>
                    <th>Families</th>
                    <th>Capacity</th>
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

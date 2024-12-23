<!-- script.js -->
const apiUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=');

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const jsonData = JSON.parse(data.contents);

        if (jsonData.ppsbuka && jsonData.ppsbuka.length > 0) {
            // Display table data
            displayData(jsonData);

            // Create visualizations
            createBarChart(jsonData.ppsbuka);
            createPieChart(jsonData.ppsbuka);
        } else {
            console.warn('Tiada data tersedia.');
        }
    })
    .catch(error => console.error('Ralat memuatkan data:', error));

function displayData(data) {
    const tableContainer = document.getElementById('table-container');
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

function createBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const dataset = data.map(item => ({
        daerah: item.daerah,
        mangsa: parseInt(item.mangsa, 10) || 0,
    }));

    const x = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.mangsa)])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(dataset.map(d => d.daerah))
        .range([0, height])
        .padding(0.1);

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", d => y(d.daerah))
        .attr("width", d => x(d.mangsa))
        .attr("height", y.bandwidth())
        .attr("fill", "#007bff");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .call(d3.axisBottom(x))
        .attr("transform", `translate(0,${height})`);
}

function createPieChart(data) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#pieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const categories = d3.group(data, d => d.kategori);
    const dataset = Array.from(categories, ([key, value]) => ({
        kategori: key,
        mangsa: d3.sum(value, d => parseInt(d.mangsa, 10) || 0),
    }));

    const color = d3.scaleOrdinal()
        .domain(dataset.map(d => d.kategori))
        .range(d3.schemeTableau10);

    const pie = d3.pie()
        .value(d => d.mangsa);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll("path")
        .data(pie(dataset))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.kategori));
}
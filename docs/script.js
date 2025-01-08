// Toggle dark mode
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Initialize tooltips
const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

// Fetch data from local JSON
async function fetchData() {
    try {
        const response = await fetch('./data/flood_data.json');
        const jsonData = await response.json();
        return jsonData.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Process data for visualization
function processData(data) {
    // Calculate totals for each district
    const districtSummary = data.map(d => ({
        district: d.daerah,
        evacuees: parseInt(d.jumlah_mangsa),
        families: parseInt(d.jumlah_keluarga),
        pps: d.pps_count
    }));

    // Calculate overall totals
    const totals = {
        pps: d3.sum(data, d => d.pps_count),
        evacuees: d3.sum(data, d => parseInt(d.jumlah_mangsa)),
        families: d3.sum(data, d => parseInt(d.jumlah_keluarga))
    };

    return { districtSummary, totals };
}

// Update summary statistics
function updateStats(totals) {
    document.querySelector('#total-pps .stat-value').textContent = totals.pps;
    document.querySelector('#total-evacuees .stat-value').textContent = totals.evacuees;
    document.querySelector('#total-families .stat-value').textContent = totals.families;
}

// Create bar chart
function createBarChart(data) {
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear existing chart
    d3.select('#bar-chart').html('');

    const svg = d3.select('#bar-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', translate(${margin.left},${margin.top}));

    // Create scales
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    // Set domains
    x.domain(data.map(d => d.district));
    y.domain([0, d3.max(data, d => d.evacuees)]);

    // Add bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.district))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.evacuees))
        .attr('height', d => height - y(d.evacuees))
        .on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(District: ${d.district}<br/>Evacuees: ${d.evacuees})
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });

    // Add axes
    svg.append('g')
        .attr('transform', translate(0,${height}))
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    svg.append('g')
        .call(d3.axisLeft(y));
}

// Create pie chart
function createPieChart(data) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Clear existing chart
    d3.select('#pie-chart').html('');

    const svg = d3.select('#pie-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', translate(${width / 2},${height / 2}));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.pps);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Add slices
    const slices = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('class', 'pie-slice')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(District: ${d.data.district}<br/>PPS: ${d.data.pps})
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}

// Create data table
function createDataTable(data) {
    const table = d3.select('#data-table')
        .append('table');

    // Add table header
    table.append('thead')
        .append('tr')
        .selectAll('th')
        .data(['District', 'PPS Count', 'Total Evacuees'])
        .enter()
        .append('th')
        .text(d => d);

    // Add table rows
    table.append('tbody')
        .selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .html(d => `
            <td>${d.district}</td>
            <td>${d.pps}</td>
            <td>${d.evacuees}</td>
        `);
}

// Initialize dashboard
async function initDashboard() {
    const rawData = await fetchData();
    if (rawData.length === 0) {
        console.error('No data received');
        return;
    }

    const { districtSummary, totals } = processData(rawData);
    
    // Update last updated time
    const lastUpdated = new Date().toLocaleString('en-MY', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    document.getElementById('update-time').textContent = lastUpdated;
    
    updateStats(totals);
    createBarChart(districtSummary);
    createPieChart(districtSummary);
    createDataTable(districtSummary);
}

// Start the dashboard
initDashboard();

{
  "data": [
    {
      "daerah": "PASIR MAS",
      "jumlah_mangsa": 2145,
      "jumlah_keluarga": 534,
      "pps_count": 12
    },
    {
      "daerah": "KOTA BHARU",
      "jumlah_mangsa": 1876,
      "jumlah_keluarga": 456,
      "pps_count": 8
    },
    {
      "daerah": "TUMPAT",
      "jumlah_mangsa": 1654,
      "jumlah_keluarga": 398,
      "pps_count": 10
    },
    {
      "daerah": "TANAH MERAH",
      "jumlah_mangsa": 987,
      "jumlah_keluarga": 245,
      "pps_count": 6
    },
    {
      "daerah": "KUALA KRAI",
      "jumlah_mangsa": 756,
      "jumlah_keluarga": 189,
      "pps_count": 5
    }
  ],
  "last_updated": "2024-12-13T12:22:13+08:00"
}
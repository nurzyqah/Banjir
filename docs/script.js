// Fetch data from the API
fetch('https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=')
    .then(response => response.json())
    .then(data => {
        // Assuming data is an array of objects
        const dataset = data; // Update this based on the actual structure of the data

        // Set dimensions for the chart
        const width = 600;
        const height = 400;
        const margin = {top: 20, right: 30, bottom: 40, left: 40};

        // Create an SVG element
        const svg = d3.select('#chart').append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create scales
        const x = d3.scaleBand()
            .domain(dataset.map(d => d.someProperty)) // Replace 'someProperty' with the actual property name
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.someValue)]) // Replace 'someValue' accordingly
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Add bars
        svg.selectAll('.bar')
            .data(dataset)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.someProperty))
            .attr('y', d => y(d.someValue))
            .attr('height', d => y(0) - y(d.someValue))
            .attr('width', x.bandwidth());
    })
    .catch(error => console.error('Error fetching data:', error));
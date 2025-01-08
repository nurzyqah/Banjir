mapboxgl.accessToken = 'your-access-token-here'; // Replace with your Mapbox access token
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [101.9758, 4.2105], // Coordinates for Malaysia
  zoom: 5
});

// CORS proxy URL
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

// URLs for GeoJSON and data
const geoJsonUrls = [
  'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson',
  'https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson'
];

const floodDataUrl = 'https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php?a=0&b=0&seasonmain_id=208&seasonnegeri_id=';

// Fetch GeoJSON Data through the CORS proxy
Promise.all(geoJsonUrls.map(url => 
  fetch(proxyUrl + url)
    .then(response => response.json())
    .catch(error => console.error('Error fetching GeoJSON:', error))
))
  .then(([semenanjungData, borneoData]) => {
    map.on('load', () => {
      map.addSource('semenanjung', {
        type: 'geojson',
        data: semenanjungData
      });
      map.addSource('borneo', {
        type: 'geojson',
        data: borneoData
      });

      map.addLayer({
        id: 'semenanjung-layer',
        type: 'fill',
        source: 'semenanjung',
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.5
        }
      });

      map.addLayer({
        id: 'borneo-layer',
        type: 'fill',
        source: 'borneo',
        paint: {
          'fill-color': '#008',
          'fill-opacity': 0.5
        }
      });
    });
  })
  .catch(error => console.error('Error in loading map data:', error));

// Fetch flood data
fetch(proxyUrl + floodDataUrl)
  .then(response => response.json())
  .then(data => {
    createTable(data);
  })
  .catch(error => {
    console.log('Error fetching flood data:', error);
  });

function createTable(data) {
  const tableContainer = d3.select("#table-container");
  const table = tableContainer.append("table");
  const header = table.append("thead").append("tr");
  const body = table.append("tbody");

  // Assume the data is an array of objects
  const columns = Object.keys(data[0]);

  columns.forEach(col => {
    header.append("th").text(col);
  });

  data.forEach(row => {
    const tr = body.append("tr");
    columns.forEach(col => {
      tr.append("td").text(row[col]);
    });
  });
}

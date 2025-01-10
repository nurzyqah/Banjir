// API URLs
const apiUrl =
  "https://api.allorigins.win/get?url=" +
  encodeURIComponent(
    "https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=0"
  );
const aliranJumMangsaUrl =
  "https://api.allorigins.win/get?url=" +
  encodeURIComponent(
    "https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id="
  );
const aliranMasukUrl =
  "https://api.allorigins.win/get?url=" +
  encodeURIComponent(
    "https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-masuk.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id="
  );
const aliranKeluarUrl =
  "https://api.allorigins.win/get?url=" +
  encodeURIComponent(
    "https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-aliran-trend-balik.php?a=0&b=0&seasonmain_id=209&seasonnegeri_id="
  );

document.addEventListener("DOMContentLoaded", () => {
  // Load data and charts
  fetchData(apiUrl, displayTable, "table-container");
  loadChart(aliranJumMangsaUrl, "Aliran Jum Mangsa", "categoryChart1");
  loadChart(aliranMasukUrl, "Aliran Mangsa Masuk", "categoryChart2");
  loadChart(aliranKeluarUrl, "Aliran Mangsa Keluar", "categoryChart3");
  fetchData(apiUrl, displayBarChart, "barChart");
  fetchData(apiUrl, displayPieChart, "floodPieChart");

  // Initialize the map
  initMap();
});

function fetchData(url, callback, containerId) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.contents) {
        const jsonData = JSON.parse(data.contents);
        callback(jsonData, containerId);
      }
    })
    .catch((error) => {
      console.error(`Error loading data from ${url}:`, error.message);
      if (containerId) {
        document.getElementById(
          containerId
        ).innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
      }
    });
}

function displayTable(data, containerId) {
  const container = document.getElementById(containerId);
  if (!data.points || data.points.length === 0) {
    container.innerHTML = "<p>No data available.</p>";
    return;
  }

  let tableHTML = `
    <table class="formal-table">
        <thead>
            <tr>
                <th>Nama PPS</th>
                <th>Negeri</th>
                <th>Daerah</th>
                <th>Bencana</th>
                <th>Mangsa</th>
                <th>Keluarga</th>
                <th>Kapasiti</th>
            </tr>
        </thead>
    <tbody>`;

  data.points.forEach((item) => {
    tableHTML += `
      <tr>
          <td>${item.name || "N/A"}</td>
          <td>${item.negeri || "N/A"}</td>
          <td>${item.daerah || "N/A"}</td>
          <td>${item.bencana || "N/A"}</td>
          <td>${item.mangsa || "N/A"}</td>
          <td>${item.keluarga || "N/A"}</td>
          <td>${item.kapasiti || "N/A"}</td>
      </tr>`;
  });

  tableHTML += "</tbody></table>";
  container.innerHTML = tableHTML;
}

function loadChart(url, title, chartId) {
  fetchData(url, (data) => {
    if (data.points) {
      const labels = data.points.map((item) => item.date || "Unknown");
      const values = data.points.map((item) => item.value || 0);

      const ctx = document.getElementById(chartId).getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: title,
              data: values,
              borderColor: "#FF6384",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  });
}

function displayBarChart(data, containerId) {
  if (!data.points) return;

  const labels = data.points.map((item) => item.negeri || "Unknown");
  const values = data.points.map((item) => parseInt(item.mangsa, 10) || 0);

  const ctx = document.getElementById(containerId).getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Jumlah Mangsa",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
}

function displayPieChart(data, containerId) {
  if (!data.points) return;

  const totalMangsa = data.points.reduce(
    (acc, item) => acc + parseInt(item.mangsa, 10),
    0
  );
  const totalKeluarga = data.points.reduce(
    (acc, item) => acc + parseInt(item.keluarga, 10),
    0
  );

  const ctx = document.getElementById(containerId).getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Mangsa", "Keluarga"],
      datasets: [
        {
          data: [totalMangsa, totalKeluarga],
          backgroundColor: ["#FF6384", "#36A2EB"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

function initMap() {
  const map = L.map("map").setView([4.2105, 101.9758], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Add more map features or data points as needed
}

document.addEventListener("DOMContentLoaded", () => {
      const form = document.querySelector(".status-form");
      const input = form.querySelector("input");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const trainNumber = urlParams.get('train')   
    if (trainNumber) {
        getTrainStatus(trainNumber)
        input.value = trainNumber
    }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const trainNumber = input.value.trim();
        getTrainStatus(trainNumber)
      });
});

async function getTrainStatus(trainNumber) {
        if (!trainNumber) {
          alert("Valid train number required");
          return;
        }

        try {
          const response = await fetch(`https://api-v3.amtraker.com/v3/trains/${trainNumber}`);
          if (!response.ok) throw new Error("Failed to fetch train status");
          const data = await response.json();

          if (!data[trainNumber]) {
            return
          }

          let statusAlerts = '';
          for (let i = 0; i < data[trainNumber].length; i++) {
            for (let x = 0; x < data[trainNumber][i]['alerts'].length; x++) {
              statusAlerts += data[trainNumber][i]['alerts'][x].message + "<br>";
            }
          }

          document.getElementById('train-status').innerHTML = statusAlerts || '';
          const container = document.getElementById("table-container");
          container.innerHTML = '';

          for (let i = 0; i < data[trainNumber].length; i++) {
            container.appendChild(buildFullScheduleTable(data[trainNumber][i]['stations'], trainNumber));
          }
          


        } catch (error) {
          console.error("error:", error);
        }
}


function buildFullScheduleTable(stations, trainNumber) {
    const table = document.createElement("table");
    const header = document.createElement("tr");
    ["Share Status", "Station", "Code", "Scheduled Arrival", "Scheduled Departure", "Arrival", "Departure", "Status"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
    });
    table.appendChild(header);

    stations.forEach(station => {
        const tr = document.createElement("tr");
        const delayMin = Math.abs((new Date(station.schArr) - new Date(station.arr)) / (1000*60));
        const delayed = delayMin > 5;
        const statusLink = `<a href="station.html?train=${encodeURIComponent(trainNumber)}&station=${encodeURIComponent(station.code)}">🔗 ${station.name}</a>`;

        tr.innerHTML = `
        <td>${statusLink}</td>
        <td>${station.name}</td>
        <td>${station.code}</td>
        <td>${station.schArr}</td>
        <td>${station.schDep}</td>
        <td>${station.arr}</td>
        <td>${station.dep}</td>
        <td>${delayed ? '‼️ Delayed' : station.status}</td>
        `;
        table.appendChild(tr);
    });

    return table;
};
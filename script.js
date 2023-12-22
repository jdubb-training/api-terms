document.addEventListener("DOMContentLoaded", function () {
    let data = []; // To store the CSV data

    // Fetch the CSV file from your local Git repository
    fetch("api-terms.csv") // Replace with the correct path to your CSV file
        .then((response) => response.text())
        .then((csv) => {
            // Parse the CSV data
            data = parseCSV(csv);
            initializeTable();
        })
        .catch((error) => {
            console.error("Error fetching CSV file:", error);
        });

    const tableBody = document.getElementById("table-body");
    const paginationControls = document.getElementById("pagination");

    let currentPage = 1;
    const rowsPerPage = 20;

    function updateTable() {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const displayedData = data.slice(start, end);

        tableBody.innerHTML = "";

        displayedData.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cellData) => {
                const td = document.createElement("td");
                td.textContent = cellData;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    function sortBy(key) {
        data.sort((a, b) => {
            const indexA = data[0].indexOf(key);
            const indexB = data[0].indexOf(key);
            return a[indexA].localeCompare(b[indexB]);
        });
        updateTable();
    }

    function initializeTable() {
        updateTable();
        paginationControls.style.display = "block";
    }

    document.getElementById("prev-page").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
        }
    });

    document.getElementById("next-page").addEventListener("click", () => {
        const maxPage = Math.ceil(data.length / rowsPerPage);
        if (currentPage < maxPage) {
            currentPage++;
            updateTable();
        }
    });
});

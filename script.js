function parseCSV(csv) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split("|").map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "") continue;
        const currentline = lines[i].split("|").map(cell => cell.trim());

        if (currentline.length !== headers.length) {
            console.warn(`Line ${i} has an incorrect number of fields.`);
            continue;
        }

        const obj = headers.reduce((accumulator, header, j) => {
            accumulator[header] = currentline[j];
            return accumulator;
        }, {});

        result.push(obj);
    }

    return result;
}

document.addEventListener("DOMContentLoaded", function () {
    let data = [];
    let csv = '';
    let lazyLoadIndex = 0;
    const lazyLoadStep = 10; // Number of rows to load each time

    fetch("api-terms.csv")
        .then(response => response.text())
        .then(rawCsv => {
            csv = rawCsv;
            data = parseCSV(csv);
            lazyLoadIndex = lazyLoadStep;
            updateTable();
        })
        .catch(error => {
            console.error("Error fetching CSV file:", error);
        });

    const tableBody = document.getElementById("table-body");
    const searchInput = document.getElementById("search-input");

    function updateTable() {
        const slicedData = data.slice(0, lazyLoadIndex);
        tableBody.innerHTML = "";

        slicedData.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");
            tr.classList.add("data-row");
            tr.addEventListener("click", () => toggleRow(rowIndex));

            Object.entries(row).forEach(([key, text]) => {
                const td = document.createElement("td");
                td.textContent = text;
                tr.appendChild(td);

                // Add tooltip
                const tooltip = document.createElement("span");
                tooltip.className = "tooltip-text";
                tooltip.textContent = text;
                td.appendChild(tooltip);
            });

            tableBody.appendChild(tr);

            // Add collapsible row
            const detailTr = document.createElement("tr");
            detailTr.classList.add("detail-row");
            const detailTd = document.createElement("td");
            detailTd.setAttribute("colspan", Object.keys(row).length);
            detailTd.textContent = "Detailed information here"; // Replace with actual details
            detailTr.appendChild(detailTd);
            tableBody.appendChild(detailTr);
        });

        highlightSearchTerms();
    }

    function toggleRow(index) {
        const detailRow = tableBody.getElementsByClassName("detail-row")[index];
        detailRow.style.display = detailRow.style.display === "none" ? "table-row" : "none";
    }

    function highlightSearchTerms() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === "") return;

        document.querySelectorAll("#table-body td").forEach(td => {
            if (td.textContent.toLowerCase().includes(searchTerm)) {
                td.classList.add("highlight");
            } else {
                td.classList.remove("highlight");
            }
        });
    }

    searchInput.addEventListener("input", function () {
        lazyLoadIndex = lazyLoadStep;
        data = parseCSV(csv);
        data = data.filter(row => row["Term"].toLowerCase().includes(this.value.trim().toLowerCase()));
        updateTable();
    });

    window.onscroll = function() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            lazyLoadMoreData();
        }
    };

    function lazyLoadMoreData() {
        if (lazyLoadIndex >= data.length) return;
        lazyLoadIndex += lazyLoadStep;
        updateTable();
    }

    updateTable();
});

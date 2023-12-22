function parseCSV(csv) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "") continue; // Skip empty lines
        let obj = {};
        let currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }

        result.push(obj);
    }

    return result;
}

document.addEventListener("DOMContentLoaded", function () {
    let data = []; // To store the CSV data

    fetch("api-terms.csv") // Replace with the correct path to your CSV file
        .then((response) => response.text())
        .then((csv) => {
            data = parseCSV(csv);
            sortByDefault();
            initializeTable();
        })
        .catch((error) => {
            console.error("Error fetching CSV file:", error);
        });

    const tableBody = document.getElementById("table-body");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    let currentPage = 1;
    const rowsPerPage = 10;

    function updateTable() {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const displayedData = data.slice(start, end);

        tableBody.innerHTML = "";

        displayedData.forEach((row) => {
            const tr = document.createElement("tr");
            for (const header in row) {
                if (row.hasOwnProperty(header)) {
                    const td = document.createElement("td");
                    td.textContent = row[header];
                    tr.appendChild(td);
                }
            }
            tableBody.appendChild(tr);
        });

        updatePageCount();
    }

    function updatePageCount() {
        const totalPages = Math.ceil(data.length / rowsPerPage);
        const paginationControls = document.getElementById("pagination-controls");
        paginationControls.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                updateTable();
            });

            if (i === currentPage) {
                pageButton.className = 'active';
            }

            paginationControls.appendChild(pageButton);
        }
    }

    function sortBy(key) {
        data.sort((a, b) => a[key].localeCompare(b[key]));
        currentPage = 1; // Reset to first page after sorting
        updateTable();
    }

    function sortByDefault() {
        data.sort((a, b) => {
            const categoryComparison = a["Category"].localeCompare(b["Category"]);
            if (categoryComparison !== 0) return categoryComparison;

            const subCategoryComparison = a["Sub-Category"].localeCompare(b["Sub-Category"]);
            if (subCategoryComparison !== 0) return subCategoryComparison;

            return a["Term"].localeCompare(b["Term"]);
        });
        currentPage = 1; // Reset to first page after sorting
        updateTable();
    }

    function initializeTable() {
        updateTable();
    }

    function searchByTerm() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === "") {
            sortByDefault();
        } else {
            data = data.filter((row) =>
                row["Term"].toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            updateTable();
        }
    }

    searchButton.addEventListener("click", searchByTerm);
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchByTerm();
        }
    });

    // Expose the sorting functions for the buttons
    window.sortBy = sortBy;
    window.sortByDefault = sortByDefault;

    updatePageCount();
});

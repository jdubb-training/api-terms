document.addEventListener("DOMContentLoaded", function () {
    let data = []; // To store the CSV data

    // Fetch the CSV file from your local Git repository
    fetch("api-terms.csv") // Replace with the correct path to your CSV file
        .then((response) => response.text())
        .then((csv) => {
            // Parse the CSV data
            data = parseCSV(csv);

            // Sort the data by "Category," "Sub-Category," and "Term" columns
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

        // Update the page count
        updatePageCount();
    }

    function updatePageCount() {
        const totalPages = Math.ceil(data.length / rowsPerPage);
        const paginationControls = document.getElementById("pagination-controls");
        paginationControls.innerHTML = ''; // Clear existing pagination

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                updateTable();
            });

            if (i === currentPage) {
                pageButton.className = 'active'; // Highlight the current page
            }

            paginationControls.appendChild(pageButton);
        }
    }

    // Add the remaining functions and event listeners here...

    // Initialize the page count
    updatePageCount();
});

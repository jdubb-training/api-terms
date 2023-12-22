// Function to calculate and update the number of pages
function updatePageCount() {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginationControls = document.getElementById("pagination");
    paginationControls.innerHTML = `Page ${currentPage} of ${totalPages}`;
}

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

    function sortBy(key) {
        data.sort((a, b) => a[key].localeCompare(b[key]));
        updateTable();
    }

    function sortByDefault() {
        // Sort by "Category," "Sub-Category," and "Term" columns
        data.sort((a, b) => {
            const categoryComparison = a["Category"].localeCompare(b["Category"]);
            if (categoryComparison !== 0) return categoryComparison;

            const subCategoryComparison = a["Sub-Category"].localeCompare(b["Sub-Category"]);
            if (subCategoryComparison !== 0) return subCategoryComparison;

            return a["Term"].localeCompare(b["Term"]);
        });
    }

    function initializeTable() {
        updateTable();
    }

    function searchByTerm() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === "") {
            // If the search input is empty, reset the table
            sortByDefault();
        } else {
            // Filter the data based on the search term in the "Term" column
            data = data.filter((row) =>
                row["Term"].toLowerCase().includes(searchTerm)
            );
        }

        // Reset the current page to 1 and update the table
        currentPage = 1;
        updateTable();
    }

    // Event listener for the search button
    searchButton.addEventListener("click", searchByTerm);

    // Event listener for the Enter key in the search input field
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchByTerm();
        }
    });

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

    // Initialize the page count
    updatePageCount();
});

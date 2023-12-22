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
    const paginationControls = document.getElementById("pagination");
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

    function sortByDefault() {
        // Sort by "Category," "Sub-Category," and "Term" columns
        data.sort((a, b) => {
            const categoryIndex = data[0].indexOf("Category");
            const subCategoryIndex = data[0].indexOf("Sub-Category");
            const termIndex = data[0].indexOf("Term");

            const categoryComparison = a[categoryIndex].localeCompare(b[categoryIndex]);
            if (categoryComparison !== 0) return categoryComparison;

            const subCategoryComparison = a[subCategoryIndex].localeCompare(b[subCategoryIndex]);
            if (subCategoryComparison !== 0) return subCategoryComparison;

            return a[termIndex].localeCompare(b[termIndex]);
        });
    }

    function initializeTable() {
        updateTable();
        paginationControls.style.display = "block";
    }

    function searchByTerm() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === "") {
            // If the search input is empty, reset the table
            sortByDefault();
        } else {
            // Filter the data based on the search term in the "Term" column
            data = data.filter((row, index) => {
                if (index === 0) return true; // Include the header row
                const termIndex = data[0].indexOf("Term");
                return row[termIndex].toLowerCase().includes(searchTerm);
            });
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
});

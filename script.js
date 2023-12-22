// JavaScript to fetch and display paginated CSV data
let data = []; // This will hold the parsed CSV data
let currentPage = 1;
const itemsPerPage = 10;

// Function to fetch and parse the CSV data
function fetchDataAndParse() {
    fetch('api-terms.csv') // Relative path to the CSV file
        .then(response => response.text())
        .then(csvData => {
            data = parseCSV(csvData); // Parse CSV data into an array of objects
            displayPage(currentPage);
            generatePaginationControls();
        });
}

// Function to parse CSV data into an array of objects
function parseCSV(csvData) {
    const lines = csvData.trim().split('\n'); // Split CSV data into lines
    if (lines.length < 2) {
        // Ensure there are at least two lines (header and data)
        return [];
    }

    const headers = lines[0].split(',').map(header => header.trim()); // Extract headers
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim()); // Extract values
        if (values.length !== headers.length) {
            // Skip lines with inconsistent data
            continue;
        }

        const entry = {};
        for (let j = 0; j < headers.length; j++) {
            entry[headers[j]] = values[j]; // Create an object with header-value pairs
        }

        data.push(entry); // Add the object to the data array
    }

    return data;
}

// Function to sort data by a specified key (e.g., 'Term' or 'Definition')
function sortBy(key) {
    // Sorting logic based on the 'key' (e.g., 'Term' or 'Definition')
    data.sort((a, b) => {
        if (a[key] < b[key]) {
            return -1;
        } else if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });

    // Call the 'displayPage' function to update the displayed data
    displayPage(currentPage);
}

// Function to display a specific page of data
function displayPage(page) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ''; // Clear existing data

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Term}</td>
            <td>${item.Definition}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to generate pagination controls
function generatePaginationControls() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination controls

    const totalPages = Math.ceil(data.length / itemsPerPage);

    if (totalPages <= 1) {
        return; // No need for pagination if there's only one page
    }

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });
        pagination.appendChild(button);
    }
}

// Call the initial fetchDataAndParse function when the page loads
window.onload = fetchDataAndParse;

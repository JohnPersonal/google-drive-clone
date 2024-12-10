// Previous code remains...

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        pdf: 'fas fa-file-pdf',
        doc: 'fas fa-file-word',
        docx: 'fas fa-file-word',
        xls: 'fas fa-file-excel',
        xlsx: 'fas fa-file-excel',
        jpg: 'fas fa-file-image',
        jpeg: 'fas fa-file-image',
        png: 'fas fa-file-image',
        txt: 'fas fa-file-alt'
    };
    return icons[ext] || 'fas fa-file';
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#fileTable tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Context Menu
function initializeContextMenu() {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', hideContextMenu);
}

function handleContextMenu(e) {
    e.preventDefault();
    const contextMenu = document.getElementById('contextMenu');
    const row = e.target.closest('tr');
    
    if (row) {
        const rect = row.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.remove('hidden');
        
        // Store the selected file info
        contextMenu.dataset.fileName = row.querySelector('td').textContent;
    }
}

function hideContextMenu() {
    document.getElementById('contextMenu').classList.add('hidden');
}

function handleContextAction(action) {
    const contextMenu = document.getElementById('contextMenu');
    const fileName = contextMenu.dataset.fileName;
    
    switch(action) {
        case 'open':
            openFile(fileName);
            break;
        case 'download':
            downloadFile(fileName);
            break;
        case 'share':
            shareFile(fileName);
            break;
        case 'rename':
            renameFile(fileName);
            break;
        case 'move':
            moveFile(fileName);
            break;
        case 'delete':
            deleteFile(fileName);
            break;
    }
    
    hideContextMenu();
}

// Dropdowns
function initializeDropdowns() {
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.dropdown-trigger')) {
            closeAllDropdowns();
        }
    });
}

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    closeAllDropdowns();
    dropdown.classList.toggle('hidden');
}

function closeAllDropdowns() {
    document.querySelectorAll('[id$="Dropdown"]').forEach(dropdown => {
        dropdown.classList.add('hidden');
    });
}

// Table Sorting
let sortDirection = 1;
function initializeSorting() {
    document.querySelectorAll('#fileTable th').forEach((header, index) => {
        header.addEventListener('click', () => sortTable(index));
    });
}

function sortTable(column) {
    const table = document.getElementById('fileTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.children[column].textContent;
        const bValue = b.children[column].textContent;
        return aValue.localeCompare(bValue) * sortDirection;
    });

    sortDirection *= -1;
    rows.forEach(row => tbody.appendChild(row));
}

// Navigation
function navigateTo(page) {
    console.log(`Navigating to: ${page}`);
    // Add actual navigation logic here
}

function openFile(fileName) {
    console.log(`Opening file: ${fileName}`);
    // Add file opening logic here
}

function openFolder(folderName) {
    console.log(`Opening folder: ${folderName}`);
    // Add folder opening logic here
}

function downloadFile(fileName) {
    console.log(`Downloading: ${fileName}`);
    // Add download logic here
}

function shareFile(fileName) {
    console.log(`Sharing: ${fileName}`);
    // Add sharing logic here
}

function renameFile(fileName) {
    const newName = prompt('Enter new name:', fileName);
    if (newName && newName !== fileName) {
        console.log(`Renaming ${fileName} to ${newName}`);
        // Add rename logic here
    }
}

function moveFile(fileName) {
    console.log(`Moving: ${fileName}`);
    // Add move logic here
}

function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        console.log(`Deleting: ${fileName}`);
        // Add delete logic here
    }
}

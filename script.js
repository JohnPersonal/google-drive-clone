// Initialize all event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeContextMenu();
    initializeDropdowns();
    initializeSorting();
    initializeFileUpload();
    initializeDropZone();
});

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
    const contextMenu = document.getElementById('contextMenu');
    
    // Add context menu event listener to table rows
    document.querySelectorAll('#fileTable tbody tr').forEach(row => {
        row.addEventListener('contextmenu', showContextMenu);
    });
    
    // Hide context menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });
}

function showContextMenu(e) {
    e.preventDefault();
    const contextMenu = document.getElementById('contextMenu');
    const rect = e.target.closest('tr').getBoundingClientRect();
    
    // Position the context menu
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.classList.remove('hidden');
    
    // Store the selected file info
    contextMenu.dataset.fileName = e.target.closest('tr').querySelector('td').textContent;
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

// File Upload Functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const newButton = document.getElementById('newButton');
    
    newButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        Array.from(files).forEach(file => uploadFile(file));
    }
}

function uploadFile(file) {
    const progress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('uploadProgressBar');
    const fileName = document.getElementById('uploadFileName');
    
    progress.classList.remove('hidden');
    fileName.textContent = `Uploading ${file.name}...`;
    
    // Simulate file upload
    let percent = 0;
    const interval = setInterval(() => {
        percent += 10;
        progressBar.style.width = `${percent}%`;
        
        if (percent >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progress.classList.add('hidden');
                addFileToTable(file);
            }, 500);
        }
    }, 200);
}

function addFileToTable(file) {
    const tbody = document.querySelector('#fileTable tbody');
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-800 cursor-pointer';
    
    const date = new Date();
    const size = (file.size / 1024).toFixed(1);
    
    tr.innerHTML = `
        <td class="py-2"><i class="${getFileIcon(file.name)} mr-2"></i>${file.name}</td>
        <td>${date.toLocaleString()}</td>
        <td>${size} KB</td>
    `;
    
    tr.addEventListener('contextmenu', showContextMenu);
    tbody.appendChild(tr);
}

// Drop Zone Functionality
function initializeDropZone() {
    const dropZone = document.getElementById('dropZone');
    const dropMessage = document.getElementById('dropMessage');
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
        dropMessage.classList.remove('hidden');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        dropMessage.classList.add('hidden');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        dropMessage.classList.add('hidden');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            Array.from(files).forEach(file => uploadFile(file));
        }
    });
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

// Navigation and File Operations
function navigateTo(page) {
    const paths = {
        'home': '/',
        'my-drive': '/my-drive',
        'shared': '/shared',
        'recent': '/recent',
        'starred': '/starred',
        'trash': '/trash'
    };
    
    // Update URL without page reload
    history.pushState({}, '', paths[page] || '/');
    // You would typically load content here based on the page
    console.log(`Navigated to: ${page}`);
}

function openFile(fileName) {
    // Implement file opening logic
    console.log(`Opening file: ${fileName}`);
}

function openFolder(folderName) {
    navigateTo(folderName);
}

function downloadFile(fileName) {
    // Implement file download logic
    console.log(`Downloading: ${fileName}`);
}

function shareFile(fileName) {
    // Implement sharing logic
    console.log(`Sharing: ${fileName}`);
}

function renameFile(fileName) {
    const newName = prompt('Enter new name:', fileName);
    if (newName && newName !== fileName) {
        // Implement rename logic
        console.log(`Renaming ${fileName} to ${newName}`);
    }
}

function moveFile(fileName) {
    // Implement move logic
    console.log(`Moving: ${fileName}`);
}

function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        // Implement delete logic
        console.log(`Deleting: ${fileName}`);
    }
}

function cancelUpload() {
    document.getElementById('uploadProgress').classList.add('hidden');
}
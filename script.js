// Initialize all event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeContextMenu();
    initializeDropdowns();
    initializeSorting();
    initializeFileUpload();
    initializeDropZone();
});

let currentUploadInterval = null;

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
    
    // Get the clicked row
    const row = e.target.closest('tr');
    if (!row) return;
    
    // Position the context menu
    const rect = row.getBoundingClientRect();
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.classList.remove('hidden');
    
    // Store the selected file info
    contextMenu.dataset.fileName = row.querySelector('td').textContent.trim();
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
    
    // Clear any existing upload
    if (currentUploadInterval) {
        clearInterval(currentUploadInterval);
    }
    
    // Simulate file upload
    let percent = 0;
    currentUploadInterval = setInterval(() => {
        percent += 10;
        progressBar.style.width = `${percent}%`;
        
        if (percent >= 100) {
            clearInterval(currentUploadInterval);
            currentUploadInterval = null;
            setTimeout(() => {
                progress.classList.add('hidden');
                progressBar.style.width = '0%';
                addFileToTable(file);
            }, 500);
        }
    }, 200);
}

function addFileToTable(file) {
    const tbody = document.querySelector('#fileTable tbody');
    
    // Clear the "No files" message if it exists
    if (tbody.querySelector('td[colspan="3"]')) {
        tbody.innerHTML = '';
    }
    
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
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
            dropMessage.classList.remove('hidden');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            dropMessage.classList.add('hidden');
            
            if (eventName === 'drop') {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    Array.from(files).forEach(file => uploadFile(file));
                }
            }
        });
    });
}

// Dropdowns
function initializeDropdowns() {
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.dropdown-trigger') && !e.target.closest('.dropdown-trigger')) {
            closeAllDropdowns();
        }
    });
}

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const isHidden = dropdown.classList.contains('hidden');
    
    closeAllDropdowns();
    
    if (isHidden) {
        dropdown.classList.remove('hidden');
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('[id$="Dropdown"]').forEach(dropdown => {
        dropdown.classList.add('hidden');
    });
}

// Table Sorting
let sortDirection = 1;
let currentSortColumn = 0;

function initializeSorting() {
    document.querySelectorAll('#fileTable th').forEach((header, index) => {
        header.addEventListener('click', () => sortTable(index));
    });
}

function sortTable(column) {
    const table = document.getElementById('fileTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Don't sort if there's only the "No files" message
    if (rows.length === 1 && rows[0].querySelector('td[colspan="3"]')) {
        return;
    }
    
    // Update sort icons
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
        header.querySelector('.fa-sort').className = 'fas fa-sort ml-1';
    });
    
    if (currentSortColumn === column) {
        sortDirection *= -1;
    } else {
        sortDirection = 1;
        currentSortColumn = column;
    }
    
    const currentHeader = headers[column];
    currentHeader.querySelector('.fa-sort').className = 
        sortDirection === 1 ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1';

    rows.sort((a, b) => {
        let aValue = a.children[column].textContent.trim();
        let bValue = b.children[column].textContent.trim();
        
        // Handle special cases
        if (column === 2) { // File size column
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
            return (aValue - bValue) * sortDirection;
        } else if (column === 1) { // Date column
            aValue = new Date(aValue);
            bValue = new Date(bValue);
            return (aValue - bValue) * sortDirection;
        }
        
        return aValue.localeCompare(bValue) * sortDirection;
    });

    rows.forEach(row => tbody.appendChild(row));
}

function updateBreadcrumb(path) {
    const breadcrumb = document.querySelector('.breadcrumb');
    const parts = path.split('/').filter(Boolean);
    
    let html = `<span class="text-gray-400 cursor-pointer hover:underline" onclick="navigateTo('home')">Home</span>`;
    let currentPath = '';
    
    parts.forEach((part, index) => {
        currentPath += '/' + part;
        html += `
            <i class="fas fa-chevron-right mx-2 text-gray-600"></i>
            ${index === parts.length - 1 
                ? `<span>${part}</span>`
                : `<span class="text-gray-400 cursor-pointer hover:underline" onclick="navigateTo('${currentPath}')">${part}</span>`
            }
        `;
    });
    
    breadcrumb.innerHTML = html;
}

// Navigation and File Operations
function navigateTo(page) {
    // Update breadcrumb
    updateBreadcrumb(page);
    
    // Update active state in sidebar
    document.querySelectorAll('nav li').forEach(item => {
        if (item.textContent.toLowerCase().includes(page)) {
            item.classList.add('bg-gray-800');
        } else {
            item.classList.remove('bg-gray-800');
        }
    });
    
    // Clear table and show loading state
    const tbody = document.querySelector('#fileTable tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="3" class="text-center py-4 text-gray-500">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Loading ${page} content...
            </td>
        </tr>
    `;
    
    // Simulate content loading
    setTimeout(() => loadPageContent(page), 1000);
}

function loadPageContent(page) {
    const tbody = document.querySelector('#fileTable tbody');
    tbody.innerHTML = ''; // Clear loading state
    
    // Add some dummy content based on the page
    const dummyContent = {
        'home': [
            { name: 'Documents', type: 'folder', date: 'Dec 1, 2024', size: '-' },
            { name: 'Projects.pdf', type: 'file', date: 'Dec 5, 2024', size: '2.5 MB' }
        ],
        'recent': [
            { name: 'Recent File 1.docx', type: 'file', date: 'Dec 10, 2024', size: '500 KB' },
            { name: 'Recent File 2.xlsx', type: 'file', date: 'Dec 9, 2024', size: '750 KB' }
        ]
    };
    
    const content = dummyContent[page] || [];
    
    if (content.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-8 text-gray-500">
                    <i class="fas fa-folder-open text-4xl mb-2"></i>
                    <p>No files in this folder</p>
                </td>
            </tr>
        `;
        return;
    }
    
    content.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-800 cursor-pointer';
        tr.innerHTML = `
            <td class="py-2">
                <i class="${item.type === 'folder' ? 'fas fa-folder' : getFileIcon(item.name)} mr-2"></i>
                ${item.name}
            </td>
            <td>${item.date}</td>
            <td>${item.size}</td>
        `;
        tr.addEventListener('contextmenu', showContextMenu);
        tbody.appendChild(tr);
    });
}

function openFile(fileName) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const previewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'txt'];
    
    if (previewableExtensions.includes(fileExtension)) {
        alert(`Previewing ${fileName}`);
    } else {
        downloadFile(fileName);
    }
}

function downloadFile(fileName) {
    alert(`Downloading ${fileName}`);
}

function shareFile(fileName) {
    prompt('Share link (Copy to clipboard):', `https://drive.example.com/share/${btoa(fileName)}`);
}

function renameFile(fileName) {
    const newName = prompt('Enter new name:', fileName);
    if (newName && newName !== fileName) {
        const fileRows = document.querySelectorAll('#fileTable tbody tr');
        fileRows.forEach(row => {
            const nameCell = row.querySelector('td');
            if (nameCell.textContent.trim() === fileName) {
                const icon = nameCell.querySelector('i').className;
                nameCell.innerHTML = `<i class="${icon} mr-2"></i>${newName}`;
            }
        });
    }
}

function moveFile(fileName) {
    alert(`Moving ${fileName} - Select destination folder`);
}

function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        const fileRows = document.querySelectorAll('#fileTable tbody tr');
        fileRows.forEach(row => {
            if (row.querySelector('td').textContent.trim() === fileName) {
                row.remove();
            }
        });
        
        // Show "No files" message if table is empty
        const tbody = document.querySelector('#fileTable tbody');
        if (!tbody.querySelector('tr')) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-8 text-gray-500">
                        <i class="fas fa-folder-open text-4xl mb-2"></i>
                        <p>No files in this folder</p>
                    </td>
                </tr>
            `;
        }
    }
}

function cancelUpload() {
    if (currentUploadInterval) {
        clearInterval(currentUploadInterval);
        currentUploadInterval = null;
    }
    const progress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('uploadProgressBar');
    progress.classList.add('hidden');
    progressBar.style.width = '0%';
}

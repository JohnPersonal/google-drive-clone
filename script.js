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

    // Update sort icons
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
        header.querySelector('.fa-sort').className = 'fas fa-sort ml-1';
    });
    
    const currentHeader = headers[column];
    currentHeader.querySelector('.fa-sort').className = 
        sortDirection === 1 ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1';

    rows.sort((a, b) => {
        let aValue = a.children[column].textContent;
        let bValue = b.children[column].textContent;
        
        // Handle size column specially
        if (column === 2) { // File size column
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
            return (aValue - bValue) * sortDirection;
        }
        
        return aValue.localeCompare(bValue) * sortDirection;
    });

    sortDirection *= -1;
    rows.forEach(row => tbody.appendChild(row));
}

// Navigation and File Operations
function navigateTo(page) {
    // Update active state in sidebar
    document.querySelectorAll('nav li').forEach(item => {
        if (item.textContent.toLowerCase().includes(page)) {
            item.classList.add('bg-gray-800');
        } else {
            item.classList.remove('bg-gray-800');
        }
    });

    const paths = {
        'home': '/',
        'my-drive': '/my-drive',
        'shared': '/shared',
        'recent': '/recent',
        'starred': '/starred',
        'trash': '/trash'
    };
    
    // Update URL without page reload
    history.pushState({page}, '', paths[page] || '/');
    
    // Clear table and show loading state
    const tbody = document.querySelector('#fileTable tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="3" class="text-center py-4">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Loading ${page} content...
            </td>
        </tr>
    `;
    
    // Simulate content loading
    setTimeout(() => {
        loadPageContent(page);
    }, 1000);
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
    
    (dummyContent[page] || []).forEach(item => {
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
        // Show preview (in real app, this would open a preview modal)
        alert(`Previewing ${fileName}`);
    } else {
        // Download non-previewable files
        downloadFile(fileName);
    }
}

function openFolder(folderName) {
    navigateTo(folderName.toLowerCase());
}

function downloadFile(fileName) {
    // Create a fake download link
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show download started notification
    alert(`Download started: ${fileName}`);
}

function shareFile(fileName) {
    const shareUrl = `https://yourdrive.com/share/${btoa(fileName)}`;
    // In a real app, you'd want to show a sharing modal here
    prompt('Copy this link to share:', shareUrl);
}

function renameFile(fileName) {
    const newName = prompt('Enter new name:', fileName);
    if (newName && newName !== fileName) {
        // Find and update the file in the table
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
    // In a real app, this would open a folder selection modal
    alert(`Moving ${fileName} - Folder selection would appear here`);
}

function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        // Find and remove the file from the table
        const fileRows = document.querySelectorAll('#fileTable tbody tr');
        fileRows.forEach(row => {
            if (row.querySelector('td').textContent.trim() === fileName) {
                row.remove();
            }
        });
    }
}

function cancelUpload() {
    document.getElementById('uploadProgress').classList.add('hidden');
}

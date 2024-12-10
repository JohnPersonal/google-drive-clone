// File Upload Handling
let currentUpload = null;

function showUploadProgress(show = true) {
    const progress = document.getElementById('uploadProgress');
    progress.classList.toggle('hidden', !show);
}

function updateUploadProgress(filename, percent) {
    document.getElementById('uploadFileName').textContent = filename;
    document.getElementById('uploadProgressBar').style.width = `${percent}%`;
}

function simulateFileUpload(file) {
    showUploadProgress();
    let progress = 0;
    currentUpload = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(currentUpload);
            setTimeout(() => {
                showUploadProgress(false);
                addFileToTable(file);
            }, 500);
        }
        updateUploadProgress(file.name, progress);
    }, 200);
}

function cancelUpload() {
    if (currentUpload) {
        clearInterval(currentUpload);
        currentUpload = null;
        showUploadProgress(false);
    }
}

function addFileToTable(file) {
    const tbody = document.querySelector('#fileTable tbody');
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-800 cursor-pointer';
    tr.innerHTML = `
        <td class="py-2"><i class="fas fa-file mr-2"></i>${file.name}</td>
        <td>${new Date().toLocaleString()}</td>
        <td>${(file.size / 1024).toFixed(1)} KB</td>
    `;
    tbody.appendChild(tr);
}

// Dropdown functionality
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const allDropdowns = document.querySelectorAll('[id$="Dropdown"]');
    allDropdowns.forEach(d => {
        if (d.id !== id) d.classList.add('hidden');
    });
    dropdown.classList.toggle('hidden');
}

// Navigation
function navigateTo(page) {
    console.log(`Navigating to ${page}`);
    // Add actual navigation logic here
}

function openFolder(folderId) {
    console.log(`Opening folder: ${folderId}`);
    // Add folder opening logic here
}

function openFile(fileId) {
    console.log(`Opening file: ${fileId}`);
    // Add file opening logic here
}

// Context Menu
function handleContextMenu(action) {
    console.log(`Performing action: ${action}`);
    document.getElementById('contextMenu').classList.add('hidden');
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const dropMessage = document.getElementById('dropMessage');
    const fileInput = document.getElementById('fileInput');
    const newButton = document.getElementById('newButton');

    // Drag and Drop
    dropZone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dropMessage.classList.remove('hidden');
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (e.relatedTarget && !dropZone.contains(e.relatedTarget)) {
            dropMessage.classList.add('hidden');
        }
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropMessage.classList.add('hidden');
        const files = Array.from(e.dataTransfer.files);
        files.forEach(simulateFileUpload);
    });

    // Context Menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const contextMenu = document.getElementById('contextMenu');
        const row = e.target.closest('tr');
        
        if (row) {
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.classList.remove('hidden');
        }
    });

    document.addEventListener('click', () => {
        document.getElementById('contextMenu').classList.add('hidden');
        const dropdowns = document.querySelectorAll('[id$="Dropdown"]');
        dropdowns.forEach(d => d.classList.add('hidden'));
    });

    // File Input
    newButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(simulateFileUpload);
    });
});

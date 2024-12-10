// DOM Elements and Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeFileUpload();
    initializeSearch();
    initializeContextMenu();
    initializeDropdowns();
    initializeSorting();
});

// File Upload Handling
let currentUpload = null;

function initializeFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const dropMessage = document.getElementById('dropMessage');
    const fileInput = document.getElementById('fileInput');
    const newButton = document.getElementById('newButton');

    // Drag and Drop Events
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // File Input Events
    newButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
}

function handleDragEnter(e) {
    e.preventDefault();
    document.getElementById('dropMessage').classList.remove('hidden');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragLeave(e) {
    e.preventDefault();
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
        document.getElementById('dropMessage').classList.add('hidden');
    }
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('dropMessage').classList.add('hidden');
    const files = Array.from(e.dataTransfer.files);
    files.forEach(simulateFileUpload);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach(simulateFileUpload);
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

function showUploadProgress(show = true) {
    const progress = document.getElementById('uploadProgress');
    progress.classList.toggle('hidden', !show);
}

function updateUploadProgress(filename, percent) {
    document.getElementById('uploadFileName').textContent = filename;
    document.getElementById('uploadProgressBar').style.width = `${percent}%`;
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
    
    const icon = getFileIcon(file.name);
    tr.innerHTML = `
        <td class="py-2"><i class="${icon} mr-2"></i>${file.name}</td>
        <td>${new Date().toLocaleString()}</td>
        <td>${(file.size / 1024).toFixed(1)} KB</td>
    `;
    
    tr.addEventListener('click', () => openFile(file.name));
    tbody.appendChild(tr);
}

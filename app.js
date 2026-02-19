const { PDFDocument } = PDFLib;

let pdfBytes = null;
let totalPages = 0;

// DOM elements
const pdfUpload = document.getElementById('pdf-upload');
const fileLabel = document.querySelector('.file-label');
const fileName = document.getElementById('file-name');
const pdfInfo = document.getElementById('pdf-info');
const totalPagesSpan = document.getElementById('total-pages');
const rangeSection = document.getElementById('range-section');
const startPageInput = document.getElementById('start-page');
const endPageInput = document.getElementById('end-page');
const extractBtn = document.getElementById('extract-btn');
const message = document.getElementById('message');

// Handle file upload
pdfUpload.addEventListener('change', handleFileSelect);

// Handle drag and drop
fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '#764ba2';
    fileLabel.style.background = '#f0f1ff';
});

fileLabel.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '#667eea';
    fileLabel.style.background = '#f8f9ff';
});

fileLabel.addEventListener('drop', async (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '#667eea';
    fileLabel.style.background = '#f8f9ff';

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        await loadPDF(files[0]);
    } else {
        showMessage('Please drop a valid PDF file', 'error');
    }
});

// Handle file selection
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        await loadPDF(file);
    }
}

// Load and process PDF
async function loadPDF(file) {
    try {
        showMessage('Loading PDF...', 'info');

        const arrayBuffer = await file.arrayBuffer();
        pdfBytes = new Uint8Array(arrayBuffer);

        const pdfDoc = await PDFDocument.load(pdfBytes);
        totalPages = pdfDoc.getPageCount();

        // Update UI
        fileName.textContent = file.name;
        totalPagesSpan.textContent = totalPages;
        pdfInfo.classList.remove('hidden');
        rangeSection.classList.remove('hidden');
        extractBtn.classList.remove('hidden');

        // Set default values
        startPageInput.max = totalPages;
        endPageInput.max = totalPages;
        startPageInput.value = 1;
        endPageInput.value = totalPages;

        showMessage(`PDF loaded successfully! ${totalPages} pages found.`, 'success');
    } catch (error) {
        console.error('Error loading PDF:', error);
        showMessage('Error loading PDF. Please make sure it\'s a valid PDF file.', 'error');
        resetUI();
    }
}

// Extract pages
extractBtn.addEventListener('click', async () => {
    const startPage = parseInt(startPageInput.value);
    const endPage = parseInt(endPageInput.value);

    // Validation
    if (!startPage || !endPage) {
        showMessage('Please enter both start and end page numbers', 'error');
        return;
    }

    if (startPage < 1 || endPage < 1) {
        showMessage('Page numbers must be greater than 0', 'error');
        return;
    }

    if (startPage > totalPages || endPage > totalPages) {
        showMessage(`Page numbers cannot exceed ${totalPages}`, 'error');
        return;
    }

    if (startPage > endPage) {
        showMessage('Start page must be less than or equal to end page', 'error');
        return;
    }

    try {
        extractBtn.disabled = true;
        showMessage('Extracting pages...', 'info');

        // Load the original PDF
        const originalPdf = await PDFDocument.load(pdfBytes);

        // Create a new PDF
        const newPdf = await PDFDocument.create();

        // Copy pages (page numbers are 0-indexed in pdf-lib)
        const pages = await newPdf.copyPages(
            originalPdf,
            Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i)
        );

        // Add all copied pages to the new document
        pages.forEach(page => newPdf.addPage(page));

        // Serialize the PDF to bytes
        const newPdfBytes = await newPdf.save();

        // Download the file
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `extracted_pages_${startPage}-${endPage}.pdf`;
        link.click();

        URL.revokeObjectURL(url);

        const pageCount = endPage - startPage + 1;
        showMessage(`Successfully extracted ${pageCount} page${pageCount > 1 ? 's' : ''}!`, 'success');
        extractBtn.disabled = false;
    } catch (error) {
        console.error('Error extracting pages:', error);
        showMessage('Error extracting pages. Please try again.', 'error');
        extractBtn.disabled = false;
    }
});

// Show message
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    message.classList.remove('hidden');
}

// Reset UI
function resetUI() {
    pdfBytes = null;
    totalPages = 0;
    fileName.textContent = 'Choose PDF file or drag & drop';
    pdfInfo.classList.add('hidden');
    rangeSection.classList.add('hidden');
    extractBtn.classList.add('hidden');
    startPageInput.value = '';
    endPageInput.value = '';
}

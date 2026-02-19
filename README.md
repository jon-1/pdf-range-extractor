# PDF Page Range Extractor

A simple, client-side web application that extracts specific page ranges from PDF files. All processing happens in your browser - your files never leave your device.

## Features

- Extract any page range from a PDF (e.g., pages 2-5 from a 100-page document)
- Drag & drop or click to upload
- Fully client-side - no server uploads required
- Clean, modern interface
- Mobile responsive

## How to Use

1. Upload a PDF file by clicking the upload area or dragging and dropping
2. Enter the start and end page numbers (inclusive)
3. Click "Extract Pages" to download your new PDF

For example, if you have a 100-page PDF and enter start: 2, end: 5, you'll get a 4-page PDF containing pages 2, 3, 4, and 5.

## Deployment to GitHub Pages

### Option 1: Via GitHub Web Interface

1. Create a new repository on GitHub
2. Upload the three files: `index.html`, `styles.css`, and `app.js`
3. Go to Settings > Pages
4. Under "Source", select "main" branch and "/ (root)" folder
5. Click Save
6. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: Via Command Line

```bash
cd pdf-range-extractor
git init
git add .
git commit -m "Initial commit: PDF page range extractor"
git branch -M main
git remote add origin https://github.com/yourusername/repository-name.git
git push -u origin main
```

Then enable GitHub Pages in your repository settings as described in Option 1.

## Local Development

Simply open `index.html` in your browser. No build process or server required!

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- [PDF-lib](https://pdf-lib.js.org/) - for PDF manipulation

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- File API
- Blob API

## Privacy

All PDF processing happens entirely in your browser. No files are uploaded to any server. This application can work completely offline (after initial load).

## License

Free to use and modify as needed.

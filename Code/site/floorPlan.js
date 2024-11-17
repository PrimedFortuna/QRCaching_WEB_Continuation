// Populate the checkboxes for all QR codes on page load
function populateCheckboxes() {
    const qrCheckboxesContainer = document.getElementById('qr-checkboxes');
    const allQRCodes = ['qr1', 'qr2', 'qr3', 'qr4', 'qr5'];

    // Create checkboxes for all QR codes
    allQRCodes.forEach(qr => {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = qr;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = qr + '-checkbox';
        checkbox.name = qr;
        checkbox.value = qr;

        checkboxLabel.appendChild(checkbox);
        qrCheckboxesContainer.appendChild(checkboxLabel);
        qrCheckboxesContainer.appendChild(document.createElement('br'));
    });
}

// Parse SVG to grid and get QR positions
function parseSVG(svg) {
    const grid = [];
    const qrcodes = {};
    const rects = svg.querySelectorAll('rect');
    const images = svg.querySelectorAll('image');

    const width = parseInt(svg.getAttribute('width'));
    const height = parseInt(svg.getAttribute('height'));

    // Initialize grid with non-walkable (0)
    for (let y = 0; y < height; y++) {
        grid[y] = [];
        for (let x = 0; x < width; x++) {
            grid[y][x] = 0; // non-walkable by default
        }
    }

    // Process walkable areas
    rects.forEach(rect => {
        if (rect.classList.contains('walkable')) {
            const x = parseInt(rect.getAttribute('x'));
            const y = parseInt(rect.getAttribute('y'));
            const w = parseInt(rect.getAttribute('width'));
            const h = parseInt(rect.getAttribute('height'));

            for (let i = x; i < x + w; i++) {
                for (let j = y; j < y + h; j++) {
                    if (i < width && j < height) {
                        grid[j][i] = 1; // Mark as walkable
                    }
                }
            }
        }
    });

    // Store QR codes positions
    images.forEach((image, index) => {
        const qrId = 'qr' + (index + 1);
        const x = parseInt(image.getAttribute('x'));
        const y = parseInt(image.getAttribute('y'));
        qrcodes[qrId] = { x, y };
    });

    return { grid, qrcodes };
}

// Event listener for form submission
document.getElementById('path-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const selectedQRCodes = [];

    // Collect selected QR codes
    ['qr1', 'qr2', 'qr3', 'qr4', 'qr5'].forEach(qr => {
        if (document.getElementById(qr + '-checkbox') && document.getElementById(qr + '-checkbox').checked) {
            selectedQRCodes.push(qr);
        }
    });

    if (selectedQRCodes.length === 0) {
        alert('Please select at least one QR code.');
        return;
    }

    // Load the SVG and parse the grid and QR positions
    const svg = document.querySelector('svg');
    const { grid, qrcodes } = parseSVG(svg);

    // Find the optimal order for the selected QR codes
    const pathOrder = [];
    let currentQR = selectedQRCodes.shift();
    pathOrder.push(currentQR);

    while (selectedQRCodes.length > 0) {
        selectedQRCodes.sort((a, b) => {
            const currentPos = qrcodes[currentQR];
            const aPos = qrcodes[a];
            const bPos = qrcodes[b];
            const distanceA = Math.abs(currentPos.x - aPos.x) + Math.abs(currentPos.y - aPos.y);
            const distanceB = Math.abs(currentPos.x - bPos.x) + Math.abs(currentPos.y - bPos.y);
            return distanceA - distanceB;
        });

        const nextQR = selectedQRCodes.shift();
        pathOrder.push(nextQR);
        currentQR = nextQR;
    }

    // Display the result
    const pathOutput = document.getElementById('path-output');
    pathOutput.textContent = `Order of QR codes to collect: ${pathOrder.join(' -> ')}`;
});

// Initialize checkboxes on page load
document.addEventListener('DOMContentLoaded', populateCheckboxes);

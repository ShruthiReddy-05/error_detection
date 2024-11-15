function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const arrowIcon = document.getElementById('dropdownArrow');
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
    arrowIcon.style.transform = dropdownContent.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
}

document.getElementById('hammingForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const dataFormat = document.getElementById('dataFormat').value;
    const data = document.getElementById('data').value.trim();

    // Convert input data to binary
    const binaryData = convertToBinary(data, dataFormat);
    if (binaryData === null) return; // Stop if invalid conversion

    // Calculate the Hamming code
    const result = calculateHammingCode(binaryData);

    // Display the Hamming code and steps
    document.getElementById('result').innerText = `Hamming Code: ${result.hammingCode}\n\nStep-by-Step Calculation:\n${result.steps.join('\n')}`;
});

// Convert input to binary based on the specified format
function convertToBinary(data, format) {
    const steps = [];
    let decimalValue;

    switch (format.toLowerCase()) {
        case 'binary':
            steps.push(`Input data is binary: ${data}`);
            decimalValue = parseInt(data, 2);
            break;
        case 'decimal':
            steps.push(`Converting decimal ${data} to binary.`);
            decimalValue = parseInt(data, 10);
            break;
        case 'hexadecimal':
            steps.push(`Converting hexadecimal ${data} to binary.`);
            decimalValue = parseInt(data, 16);
            break;
        case 'octal':
            steps.push(`Converting octal ${data} to binary.`);
            decimalValue = parseInt(data, 8);
            break;
        default:
            alert("Invalid format selected.");
            return null;
    }

    if (isNaN(decimalValue)) {
        alert("Invalid input. Please check your data input for the selected format.");
        return null;
    }

    const binaryData = decimalValue.toString(2);
    steps.push(`Binary equivalent: ${binaryData}`);

    // Show the conversion steps
    const conversionStepsElement = document.getElementById('conversionSteps');
    if (conversionStepsElement) {
        conversionStepsElement.innerText = steps.join('\n');
    }

    return binaryData;
}

// Calculate Hamming Code and provide detailed steps
function calculateHammingCode(data) {
    const steps = [];
    const bits = data.split('').map(Number);
    const m = bits.length;
    let r = 0;

    // Determine the number of parity bits required
    while (Math.pow(2, r) < m + r + 1) {
        r++;
    }

    const hammingCode = new Array(m + r).fill(0);

    // Insert data bits into positions that are not powers of 2 (parity bits positions)
    let dataIndex = 0;
    for (let i = 1; i <= hammingCode.length; i++) {
        if ((i & (i - 1)) === 0) { // Power of 2, reserved for parity bits
            steps.push(`Position ${i}: Reserved for parity`);
        } else {
            hammingCode[i - 1] = bits[dataIndex++];
            steps.push(`Position ${i}: Data bit ${hammingCode[i - 1]}`);
        }
    }

    // Calculate parity bits for each power of 2 position
    for (let i = 0; i < r; i++) {
        const parityPos = 1 << i; // Position of the parity bit (power of 2)
        let count = 0;

        steps.push(`\nCalculating parity for position ${parityPos}:`);

        // Check positions controlled by this parity bit
        for (let k = parityPos - 1; k < hammingCode.length; k += 2 * parityPos) {
            for (let j = k; j < k + parityPos && j < hammingCode.length; j++) {
                if (j !== parityPos - 1) { // Skip the parity bit position itself
                    count += hammingCode[j];
                    steps.push(`Bit at position ${j + 1} is ${hammingCode[j]}`);
                }
            }
        }

        // Set the parity bit (even parity)
        const parityBit = count % 2 === 0 ? 0 : 1;
        hammingCode[parityPos - 1] = parityBit;
        steps.push(`Set parity bit at position ${parityPos} to ${parityBit}\n`);
    }

    return { hammingCode: hammingCode.join(''), steps };
}






function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const arrowIcon = document.getElementById('dropdownArrow');
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
    arrowIcon.style.transform = dropdownContent.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
}
// Convert input to binary based on the specified format
function convertNumber(data, fromFormat, toFormat) {
    let decimalValue;

    // Parse the input to decimal based on the fromFormat
    switch (fromFormat.toLowerCase()) {
        case 'binary':
            decimalValue = parseInt(data, 2);
            break;
        case 'hexadecimal':
            decimalValue = parseInt(data, 16);
            break;
        case 'decimal':
            decimalValue = parseInt(data, 10);
            break;
        case 'octal':
            decimalValue = parseInt(data, 8);
            break;
        default:
            alert("Invalid format selected.");
            return null; // Invalid format
    }

    if (isNaN(decimalValue)) {
        alert("Invalid input. Please check your data input for the selected format.");
        return null;
    }
    
    // Convert decimal to the target format
    switch (toFormat.toLowerCase()) {
        case 'binary':
            return decimalValue.toString(2).padStart(8, '0'); // Ensure 8-bit format for output
        case 'hexadecimal':
            return decimalValue.toString(16).toUpperCase();
        case 'decimal':
            return decimalValue.toString(10);
        case 'octal':
            return decimalValue.toString(8);
        default:
            alert("Invalid target format.");
            return null;
    }
}

// Calculate the checksum based on 8-bit chunks and provide step-by-step details
function calculateChecksumBinary(data) {
    const steps = [];
    const binaryData = data.padStart(Math.ceil(data.length / 8) * 8, '0'); // Pad to the nearest 8-bit boundary
    const bits = binaryData.match(/.{1,8}/g); // Split into 8-bit chunks
    let checksum = '00000000';

    // Sum up each byte in binary
    bits.forEach((byte, index) => {
        const result = addBinary(checksum, byte.padStart(8, '0')); // Pad each chunk to ensure 8 bits
        steps.push(`Adding byte ${index + 1} (${byte.padStart(8, '0')}):`);
        steps.push(`Previous checksum: ${checksum}`);
        steps.push(`Intermediate sum: ${result.intermediateSum}`);
        steps.push(`Carry (if overflowed): ${result.carry}`);
        checksum = result.sumWithCarry; // Update checksum with carry applied
        steps.push(`Updated checksum: ${checksum}`);
    });

    return { checksum, steps };
}

// Helper function to add two 8-bit binary strings
function addBinary(a, b) {
    let carry = 0;
    let sum = '';

    for (let i = 7; i >= 0; i--) {
        const bitA = parseInt(a[i], 10);
        const bitB = parseInt(b[i], 10);
        const total = bitA + bitB + carry;
        sum = (total % 2) + sum;
        carry = total > 1 ? 1 : 0;
    }

    // Handle overflow by adding carry to the sum if it exists
    let finalSum = sum;
    if (carry) {
        const carryResult = addBinary(sum, '00000001');
        finalSum = carryResult.sumWithCarry;
    }

    return {
        intermediateSum: sum,
        carry: carry ? '1' : '0',
        sumWithCarry: finalSum
    };
}

// Handle the form submission for checksum calculation
document.getElementById('checksumForm')?.addEventListener('submit', function(event) { 
    event.preventDefault();

    const dataFormat = document.getElementById('dataFormat').value;
    const data = document.getElementById('data').value.trim();

    // Convert input data to binary
    const binaryData = convertNumber(data, dataFormat, 'binary');
    if (binaryData === null) return; // Stop if invalid conversion

    // Calculate checksum and steps
    const result = calculateChecksumBinary(binaryData);
    
    // Display checksum and step-by-step calculations
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerText = `Checksum: ${result.checksum}\n\nStep-by-Step Calculation:\n${result.steps.join('\n')}`;
});


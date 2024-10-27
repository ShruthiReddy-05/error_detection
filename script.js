document.getElementById('crcForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value;
    const polynomial = document.getElementById('polynomial').value;

    const { crc, divisionSteps, finalRemainder } = calculateCRC(data, polynomial);
    document.getElementById('result').innerText = `CRC: ${crc}`;
    document.getElementById('divisionTable').innerHTML = divisionSteps.join('<br>');
    document.getElementById('finalRemainder').innerText = `Remainder: ${finalRemainder}`;
});

function calculateCRC(data, polynomial) {
    const polyLength = polynomial.length;
    // Pad data with zeros equal to the polynomial length minus one
    let paddedData = data + '0'.repeat(polyLength - 1);
    let remainder = paddedData.split('');
    let steps = [];
    
    // Add header information to the steps
    steps.push(`Binary form: ${data} divided by ${polynomial}`);
    steps.push(`Binary form (added zeros): ${paddedData} divided by ${polynomial}`);
    
    for (let i = 0; i < data.length; i++) {
        if (remainder[i] === '1') {
            // Show the polynomial and perform XOR
            steps.push(' '.repeat(i) + polynomial + ' ← XOR with Polynomial');
            for (let j = 0; j < polyLength; j++) {
                // Perform XOR operation
                remainder[i + j] = (remainder[i + j] === polynomial[j]) ? '0' : '1';
            }
        } else {
            steps.push(' '.repeat(i) + '← No XOR (skipped)');
        }

        // Show the current state of the remainder
        steps.push(`${' '.repeat(i)}${remainder.join('')}`);
        steps.push(' '.repeat(i) + '---');
    }

    // Final Remainder
    const finalRemainder = remainder.slice(-polyLength + 1).join('');
    steps.push(`Final Remainder: ${finalRemainder}`);
    
    // Calculate CRC
    const crc = data + finalRemainder; // Transmitted value
    steps.push(`Transmitted value: ${crc}`);

    return { crc, divisionSteps: steps, finalRemainder };
}


//LRC Calculation

document.getElementById('vrcForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value;

    const { vrc, parityBit } = calculateVRC(data);
    document.getElementById('result').innerText = `VRC: ${vrc}\nParity Bit: ${parityBit}`;
});

function calculateVRC(data) {
    let countOnes = 0;

    // Count the number of '1's in the data
    for (let char of data) {
        if (char === '1') {
            countOnes++;
        }
    }

    // Determine the parity bit (0 if even, 1 if odd)
    const parityBit = countOnes % 2 === 0 ? '0' : '1';

    // Construct the VRC
    const vrc = data + parityBit;

    return { vrc, parityBit };
}

// LRC Calculation Functionality
document.getElementById('lrcForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value.split(' ');
    const { lrc, steps } = calculateLRC(data);

    document.getElementById('result').innerText = `LRC: ${lrc}\n\nCalculation Steps:\n${steps.join('\n')}`;
});

function calculateLRC(data) {
    const lrcBits = [];
    const rowLength = data[0].length; // Assuming all rows are of equal length
    let steps = [];

    // Generate LRC bits
    for (let i = 0; i < rowLength; i++) {
        let sum = 0;
        steps.push(`Column ${i + 1}:`);
        
        data.forEach((row, index) => {
            const bit = parseInt(row[i]);
            sum += bit;
            steps.push(`Row ${index + 1}: ${bit} (Sum: ${sum})`);
        });
        
        const lrcBit = sum % 2;
        lrcBits.push(lrcBit);
        steps.push(`LRC Bit for Column ${i + 1}: ${lrcBit}`);
        steps.push(''); // Blank line for readability
    }
    
    return { lrc: lrcBits.join(''), steps };
}


// VRC Calculation Functionality
// VRC Calculation Functionality
document.getElementById('vrcForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value.split(' ');
    const vrcResults = calculateVRC(data);
    const transmittedData = vrcResults.transmittedData.join(' ');
    document.getElementById('result').innerText = `Transmitted Data: ${transmittedData}\nVRC: ${vrcResults.vrc}\nStepwise Calculation:\n${vrcResults.steps.join('\n')}`;
});

function calculateVRC(data) {
    const vrcBits = [];
    const transmittedData = [];
    const steps = [];

    data.forEach(row => {
        let sum = 0;
        for (let char of row) {
            sum += parseInt(char);
        }
        const vrc = sum % 2 === 0 ? '0' : '1';  // Determine the parity bit
        vrcBits.push(vrc);
        transmittedData.push(row + vrc);  // Append the VRC to the data
        steps.push(`Row: ${row} | Sum: ${sum} | VRC: ${vrc}`); // Stepwise calculation
    });

    return { vrc: vrcBits.join(''), transmittedData, steps };
}

// Function to check received VRC
document.getElementById('checkVrcForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const receivedData = document.getElementById('receivedData').value.split(' ');
    const checkResults = checkVRC(receivedData);
    document.getElementById('checkResult').innerText = checkResults.join('\n');
});

function checkVRC(data) {
    const results = [];

    data.forEach(row => {
        const receivedVRC = row.slice(-1); // Last bit is the VRC
        const originalData = row.slice(0, -1); // Data without the VRC
        const sum = originalData.split('').reduce((acc, bit) => acc + parseInt(bit), 0);
        const calculatedVRC = sum % 2 === 0 ? '0' : '1'; // Calculate VRC

        results.push(`Data: ${originalData} | Received VRC: ${receivedVRC} | Calculated VRC: ${calculatedVRC} - ${receivedVRC === calculatedVRC ? 'Accepted' : 'Rejected'}`);
    });

    return results;
}




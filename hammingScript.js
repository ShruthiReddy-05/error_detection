document.getElementById('hammingForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value;
    if (!/^[01]+$/.test(data)) {
        alert('Please enter a valid binary number.');
        return;
    }

    const result = calculateHammingCode(data);
    document.getElementById('result').innerText = `Hamming Code: ${result.hammingCode}\n\nStep-by-Step Calculation:\n${result.steps.join('\n')}`;
});

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

    // Insert data bits into positions that are not powers of 2
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
        const parityPos = 1 << i; // Calculate the position of the parity bit
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

        const parityBit = count % 2 === 0 ? 0 : 1;
        hammingCode[parityPos - 1] = parityBit;
        steps.push(`Set parity bit at position ${parityPos} to ${parityBit}\n`);
    }

    return { hammingCode: hammingCode.join(''), steps };
}


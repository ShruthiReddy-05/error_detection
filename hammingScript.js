document.getElementById('hammingForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value;
    const result = calculateHammingCode(data);
    document.getElementById('result').innerText = `Hamming Code: ${result.hammingCode}\n\nStep-by-Step Calculation:\n${result.steps.join('\n')}`;
});

function calculateHammingCode(data) {
    const steps = [];
    const bits = data.split('').map(Number);
    let m = bits.length;
    let r = 0;

    // Determine the number of parity bits needed
    while (Math.pow(2, r) < m + r + 1) {
        r++;
    }

    const hammingCode = new Array(m + r).fill(0);

    // Insert data bits in positions that are not powers of 2
    let j = 0;
    for (let i = 1; i <= hammingCode.length; i++) {
        if ((i & (i - 1)) === 0) { // Power of 2, reserve for parity bit
            steps.push(`Position ${i}: Reserved for parity`);
        } else {
            hammingCode[i - 1] = bits[j++];
            steps.push(`Position ${i}: Data bit ${hammingCode[i - 1]}`);
        }
    }

    // Calculate parity bits
    for (let i = 0; i < r; i++) {
        const parityPos = 1 << i;
        let count = 0;

        steps.push(`\nCalculating parity for position ${parityPos}:`);
        for (let k = parityPos - 1; k < hammingCode.length; k += 2 * parityPos) {
            for (let m = k; m < k + parityPos && m < hammingCode.length; m++) {
                if (m !== parityPos - 1) { // Skip the parity bit position itself
                    count += hammingCode[m];
                    steps.push(`Bit at position ${m + 1} is ${hammingCode[m]}`);
                }
            }
        }

        const parityBit = count % 2 === 0 ? 0 : 1;
        hammingCode[parityPos - 1] = parityBit;
        steps.push(`Set parity bit at position ${parityPos} to ${parityBit}\n`);
    }

    return { hammingCode: hammingCode.join(''), steps };
}

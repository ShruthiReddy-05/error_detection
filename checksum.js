document.getElementById('checksumForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value;
    const result = calculateChecksumBinary(data);
    document.getElementById('result').innerText = `Checksum: ${result.checksum}\n\nStep-by-Step Calculation:\n${result.steps.join('\n')}`;
});

function calculateChecksumBinary(data) {
    const steps = [];
    const bits = data.match(/.{1,8}/g); // Split into 8-bit chunks
    let checksum = '00000000';

    // Sum up each byte in binary
    bits.forEach((byte, index) => {
        const result = addBinary(checksum, byte);
        steps.push(`Adding byte ${index + 1} (${byte}):`);
        steps.push(`Previous checksum: ${checksum}`);
        steps.push(`Intermediate sum: ${result.intermediateSum}`);
        steps.push(`Carry (if overflowed): ${result.carry}`);
        checksum = result.sumWithCarry; // Update checksum with carry applied
        steps.push(`Updated checksum: ${checksum}`);
    });

    return { checksum, steps };
}

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
        carry = carryResult.carry;
    }

    return {
        intermediateSum: sum,
        carry: carry ? '1' : '0',
        sumWithCarry: finalSum
    };
}


document.getElementById('checksumForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const data = document.getElementById('data').value;
    const result = calculateChecksum(data);
    document.getElementById('result').innerText = `Checksum: ${result.checksum}\n\nStep-by-Step Calculation:\n${result.steps.join('\n')}`;
});

function calculateChecksum(data) {
    const steps = [];
    const bits = data.match(/.{1,8}/g).map(byte => parseInt(byte, 2)); // Split into 8-bit chunks and convert to integers
    let sum = 0;

    // Sum up each byte
    bits.forEach((byte, index) => {
        sum += byte;
        steps.push(`Adding byte ${index + 1} (${byte.toString(2).padStart(8, '0')}): Current sum = ${sum}`);
    });

    // Calculate checksum as sum modulo 256
    const checksum = sum % 256;
    steps.push(`Total sum = ${sum}`);
    steps.push(`Checksum (sum % 256) = ${checksum}`);

    // Convert checksum to binary string for display
    const checksumBinary = checksum.toString(2).padStart(8, '0');
    steps.push(`Checksum in binary = ${checksumBinary}`);

    return { checksum: checksumBinary, steps };
}

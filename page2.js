function clearAllFields() {
    document.getElementById('bandwidth').value = '';
    document.getElementById('subcarrierSpacing').value = '';
    document.getElementById('ofdmSymbols').value = '';
    document.getElementById('qam').value = '2';
    document.getElementById('resourceBlocks').value = '';
    document.getElementById('duration').value = '';
    hideResults();
}

function hideResults() {
    const results = document.getElementsByClassName('result-item');
    for (let result of results) {
        result.style.display = 'none';
    }
}

function convertUnits(value, unit) {
    switch(unit) {
        case 'Hz':
            return value;
        case 'kHz':
            return value * 1e3;
        case 'MHz':
            return value * 1e6;
        case 'GHz':
            return value * 1e9;
        case 'sec':
            return value;
        case 'msec':
            return value * 1e-3;
        case 'nsec':
            return value * 1e-9;
        case 'usec':
            return value * 1e-6;
        default:
            return value;
    }
}

function calculateBitsPerResourceElement() {
    const qam = parseInt(document.getElementById('qam').value);
    if (qam <= 0) {
        alert('QAM must be a positive integer.');
        return;
    }
    const bitsPerResourceElement = Math.floor(Math.log2(qam)); // log2(QAM)
    displayResult('bitsPerResourceElement', `Bits per Resource Element: ${bitsPerResourceElement} bits`);
}

function calculateBitsPerOFDMSymbol() {
    const bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const subcarrierSpacing = parseFloat(document.getElementById('subcarrierSpacing').value);
    const subcarrierSpacingUnit = document.getElementById('subcarrierSpacingUnit').value;

    if (bandwidth <= 0 || subcarrierSpacing <= 0) {
        alert('Bandwidth and Subcarrier Spacing must be positive values.');
        return;
    }

    const bandwidthConverted = convertUnits(bandwidth, bandwidthUnit);
    const subcarrierSpacingConverted = convertUnits(subcarrierSpacing, subcarrierSpacingUnit);

    const qam = parseInt(document.getElementById('qam').value);
    if (qam <= 0) {
        alert('QAM must be a positive integer.');
        return;
    }
    const bitsPerResourceElement = Math.floor(Math.log2(qam)); // log2(QAM)
    const numResourceElements = Math.floor(bandwidthConverted / subcarrierSpacingConverted); // Number of resource elements per resource block
    const bitsPerOFDMSymbol = Math.floor(bitsPerResourceElement * numResourceElements); // bits per OFDM symbol
    displayResult('bitsPerOFDMSymbol', `Bits per OFDM Symbol: ${bitsPerOFDMSymbol} bits`);
}

function calculateBitsPerResourceBlock() {
    const bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const subcarrierSpacing = parseFloat(document.getElementById('subcarrierSpacing').value);
    const subcarrierSpacingUnit = document.getElementById('subcarrierSpacingUnit').value;
    const ofdmSymbols = parseInt(document.getElementById('ofdmSymbols').value);

    if (bandwidth <= 0 || subcarrierSpacing <= 0 || ofdmSymbols <= 0) {
        alert('Bandwidth, Subcarrier Spacing, and OFDM Symbols must be positive values.');
        return;
    }

    const bandwidthConverted = convertUnits(bandwidth, bandwidthUnit);
    const subcarrierSpacingConverted = convertUnits(subcarrierSpacing, subcarrierSpacingUnit);

    const qam = parseInt(document.getElementById('qam').value);
    if (qam <= 0) {
        alert('QAM must be a positive integer.');
        return;
    }
    const bitsPerResourceElement = Math.floor(Math.log2(qam)); // log2(QAM)
    const numResourceElements = Math.floor(bandwidthConverted / subcarrierSpacingConverted); // Number of resource elements per resource block
    const bitsPerOFDMSymbol = Math.floor(bitsPerResourceElement * numResourceElements); // bits per OFDM symbol
    const bitsPerResourceBlock = Math.floor(bitsPerOFDMSymbol * ofdmSymbols); // bits per resource block
    displayResult('bitsPerResourceBlock', `Bits per Resource Block: ${bitsPerResourceBlock} bits`);
}

function calculateMaxTransmissionRate() {
    const resourceBlocks = parseInt(document.getElementById('resourceBlocks').value);
    const bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const subcarrierSpacing = parseFloat(document.getElementById('subcarrierSpacing').value);
    const subcarrierSpacingUnit = document.getElementById('subcarrierSpacingUnit').value;
    const ofdmSymbols = parseInt(document.getElementById('ofdmSymbols').value);
    const duration = parseFloat(document.getElementById('duration').value);
    const durationUnit = document.getElementById('durationUnit').value;

    if (resourceBlocks <= 0 || bandwidth <= 0 || subcarrierSpacing <= 0 || ofdmSymbols <= 0 || duration <= 0) {
        alert('Resource Blocks, Bandwidth, Subcarrier Spacing, OFDM Symbols, and Duration must be positive values.');
        return;
    }

    const bandwidthConverted = convertUnits(bandwidth, bandwidthUnit);
    const subcarrierSpacingConverted = convertUnits(subcarrierSpacing, subcarrierSpacingUnit);
    const durationConverted = convertUnits(duration, durationUnit);

    const qam = parseInt(document.getElementById('qam').value);
    if (qam <= 0) {
        alert('QAM must be a positive integer.');
        return;
    }
    const bitsPerResourceElement = Math.floor(Math.log2(qam)); // log2(QAM)
    const numResourceElements = Math.floor(bandwidthConverted / subcarrierSpacingConverted); // Number of resource elements per resource block
    const bitsPerOFDMSymbol = Math.floor(bitsPerResourceElement * numResourceElements); // bits per OFDM symbol
    const bitsPerResourceBlock = Math.floor(bitsPerOFDMSymbol * ofdmSymbols); // bits per resource block
    const maxTransmissionRate = Math.floor((bitsPerResourceBlock * resourceBlocks) / durationConverted); // bps
    displayResult('maxTransmissionRate', `Max Transmission Rate: ${maxTransmissionRate} bps`);
}

function displayResult(elementId, resultText) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<p>${resultText}</p>`;
}

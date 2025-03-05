let samplingRate = 0;
let quantizerLevels = 0;
let sourceEncoderBitRate = 0;
let channelEncoderBitRate = 0;

// Function to calculate Sampling Rate
function calculateSamplingRate() {
    const bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;

    if (isNaN(bandwidth) || bandwidth <= 0) {
        alert('Please enter a positive value for Bandwidth');
        return;
    }

    let bandwidthMultiplier = 1;
    switch (bandwidthUnit) {
        case 'KHz':
            bandwidthMultiplier = 1e3;
            break;
        case 'MHz':
            bandwidthMultiplier = 1e6;
            break;
        case 'GHz':
            bandwidthMultiplier = 1e9;
            break;
        default:
            // 'Hz' case, default multiplier is 1
            break;
    }

    const actualBandwidth = bandwidth * bandwidthMultiplier;

    samplingRate = 2 * actualBandwidth;
    displayResult('samplingRateResult', `Sampling Rate: ${samplingRate} Hz`);
}

// Function to calculate Quantizer Levels
function calculateQuantizerLevels() {
    const numBits = parseFloat(document.getElementById('numBits').value);
    if (isNaN(numBits) || numBits <= 0) {
        alert('Please enter a positive value for Number of Bits');
        return;
    }
    quantizerLevels = Math.pow(2, numBits);
    displayResult('quantizerLevelsResult', `Quantizer Levels: ${quantizerLevels} Levels`);
}

// Function to calculate Input Bits to Source Encoder
function calculateInputBits() {
    const numBits = parseFloat(document.getElementById('numBits').value);
    if (isNaN(numBits) || numBits <= 0) {
        alert('Please enter a positive value for Number of Bits');
        return;
    }
    if (samplingRate === 0) {
        alert('Please calculate Sampling Rate first');
        return;
    }

    const inputBits = samplingRate * numBits;

    displayResult('inputBitsResult', `Input Bits to Source Encoder: ${inputBits} bps`);
}

// Function to calculate Source Encoder Bit Rate
function calculateSourceEncoderBitRate() {
    const compressionRate = parseFloat(document.getElementById('compressionRate').value);
    const numBits = parseFloat(document.getElementById('numBits').value);
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;

    if (isNaN(compressionRate) || compressionRate <= 0 || compressionRate > 1) {
        alert('Please enter a Compression Rate between 0 and 1');
        return;
    }
    if (isNaN(numBits) || numBits <= 0) {
        alert('Please enter a positive value for Number of Bits');
        return;
    }
    if (samplingRate === 0) {
        alert('Please calculate Sampling Rate first');
        return;
    }

    let bandwidthMultiplier = 1;
    switch (bandwidthUnit) {
        case 'KHz':
            bandwidthMultiplier = 1e3;
            break;
        case 'MHz':
            bandwidthMultiplier = 1e6;
            break;
        case 'GHz':
            bandwidthMultiplier = 1e9;
            break;
        default:
            // 'Hz' case, default multiplier is 1
            break;
    }

    const actualBandwidth = parseFloat(document.getElementById('bandwidth').value) * bandwidthMultiplier;

    samplingRate = 2 * actualBandwidth;
    sourceEncoderBitRate = samplingRate * numBits * compressionRate;

    displayResult('samplingRateResult', `Sampling Rate: ${samplingRate} Hz`);
    displayResult('sourceEncoderBitRateResult', `Source Encoder Bit Rate: ${sourceEncoderBitRate} bps`);
}

// Function to calculate Channel Encoder Bit Rate
function calculateChannelEncoderBitRate() {
    const channelEncoderRate = parseFloat(document.getElementById('channelEncoderRate').value);
    if (isNaN(channelEncoderRate) || channelEncoderRate <= 0 || channelEncoderRate > 1) {
        alert('Please enter a Channel Encoder Rate between 0 and 1');
        return;
    }
    if (sourceEncoderBitRate === 0) {
        alert('Please calculate Source Encoder Bit Rate first');
        return;
    }
    channelEncoderBitRate = sourceEncoderBitRate / channelEncoderRate;
    displayResult('channelEncoderBitRateResult', `Channel Encoder Bit Rate: ${channelEncoderBitRate} bps`);
}

// Function to display Interleaver Bit Rate
function displayInterleaverBitRate() {
    const interleaverBits = document.getElementById('interleaverBits').value;
    if (interleaverBits && channelEncoderBitRate) {
        displayResult('interleaverBitRateResult', `Interleaver Bit Rate: ${channelEncoderBitRate} bps`);
    } else {
        displayResult('interleaverBitRateResult', 'Please enter a valid value for Interleaver Bits');
    }
}

// Function to display results
function displayResult(elementId, resultText) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.innerHTML = `<p>${resultText}</p>`;
}

// Function to clear all input fields and results
function clearFieldsAndResults() {
    document.getElementById('bandwidth').value = '';
    document.getElementById('numBits').value = '';
    document.getElementById('compressionRate').value = '';
    document.getElementById('channelEncoderRate').value = '';
    document.getElementById('interleaverBits').value = '';
    document.getElementById('samplingRateResult').innerHTML = '';
    document.getElementById('quantizerLevelsResult').innerHTML = '';
    document.getElementById('sourceEncoderBitRateResult').innerHTML = '';
    document.getElementById('channelEncoderBitRateResult').innerHTML = '';
    document.getElementById('interleaverBitRateResult').innerHTML = '';
    document.getElementById('inputBitsResult').innerHTML = ''; // Clear input bits result
    samplingRate = 0;
    quantizerLevels = 0;
    sourceEncoderBitRate = 0;
    channelEncoderBitRate = 0;
}

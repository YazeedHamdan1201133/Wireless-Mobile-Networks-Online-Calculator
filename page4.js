function clearAllFields() {
    document.getElementById('frameRate').value = '';
    document.getElementById('frameSize').value = '';
    document.getElementById('bandwidth').value = '';
    document.getElementById('propagationTime').value = '';
    document.getElementById('csmaType').value = 'unslottedNonPersistent';
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
        case 'Kframes/sec':
        case 'Kbits':
        case 'Kbps':
            return value * 1e3;
        case 'Mframes/sec':
        case 'Mbits':
        case 'Mbps':
            return value * 1e6;
        case 'Gframes/sec':
        case 'Gbits':
        case 'Gbps':
            return value * 1e9;
        case 'nsec':
            return value * 1e-9;
        case 'µsec':
            return value * 1e-6;
        case 'msec':
            return value * 1e-3;
        case 'none':
            return value;
        default:
            return value;
    }
}

function calculateParameters() {
    const frameRate = parseFloat(document.getElementById('frameRate').value);
    const frameSize = parseFloat(document.getElementById('frameSize').value);
    const bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const propagationTime = parseFloat(document.getElementById('propagationTime').value);

    const frameRateUnit = document.getElementById('frameRateUnit').value;
    const frameSizeUnit = document.getElementById('frameSizeUnit').value;
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const propagationTimeUnit = document.getElementById('propagationTimeUnit').value;

    if (frameRate < 0 || frameSize < 0 || bandwidth < 0 || propagationTime < 0) {
        alert('Please enter positive values for all parameters.');
        return;
    }

    const frameRateConverted = convertUnits(frameRate, frameRateUnit);
    const frameSizeBits = convertUnits(frameSize, frameSizeUnit);
    const bandwidthBps = convertUnits(bandwidth, bandwidthUnit);
    const propagationTimeConverted = convertUnits(propagationTime, propagationTimeUnit);

    // Calculate T (Transmission time)
    const T = frameSizeBits / bandwidthBps;
    displayResult('resultT', `T (Transmission time): ${T.toFixed(6)} sec`);

    // Calculate G (Offered load)
    const G = frameRateConverted * T;
    displayResult('resultG', `G (Offered load): ${G.toFixed(6)}`);

    // Calculate alpha (Propagation time ratio)
    const alpha = propagationTimeConverted / T;
    displayResult('resultAlpha', `α (Alpha): ${alpha.toFixed(6)}`);

    calculateThroughput(G, alpha, T);
}

function calculateThroughput(G, alpha, T) {
    const csmaType = document.getElementById('csmaType').value;
    
    let throughput = 0;

    switch(csmaType) {
        case 'unslottedNonPersistent':
            throughput = (G * Math.exp(- 2* alpha * T)) / (G * (1 + 2 * alpha) + Math.exp(-alpha * G));
            break;
        case 'slottedNonPersistent':
            throughput = (alpha * G * Math.exp(-2 * alpha * T)) /  (1 - Math.exp(-alpha * G)+ alpha);
            break;
        case 'unslotted1Persistent':
            throughput = (G * (1 + G + alpha * G * (1 + G + (alpha * G) / 2)) * Math.exp(-G * (1 + 2 * alpha))) / 
                         (G * (1 + 2 * alpha) - (1 - Math.exp(- alpha * G)) + (1 + alpha * G) * Math.exp(-G * (1 + alpha)));
            break;
        case 'slotted1Persistent':
            throughput = (G * (1 + alpha - Math.exp(-alpha * G)) * Math.exp(-G * (1 + alpha))) / 
                         ((1 + alpha) * (1 - Math.exp(-alpha * G)) + alpha * Math.exp(-G * (1 + alpha)));
            break;
    }

    displayResult('resultThroughput', `Throughput (S): ${throughput.toFixed(4)} or ${(throughput * 100).toFixed(2)}%`);
}

function displayResult(elementId, resultText) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<p>${resultText}</p>`;
}

const ebNoTable = {
    "BPSK/QPSK": {
        "10^-2": 4,
        "10^-3": 7,
        "10^-4": 8.2,
        "10^-5": 9.8,
        "10^-6": 10.5,
        "10^-7": 11.2
    },
    "8-PSK": {
        "10^-2": 7,
        "10^-3": 10,
        "10^-4": 12,
        "10^-5": 13,
        "10^-6": 14,
        "10^-7": 14.8
    },
    "16-PSK": {
        "10^-2": 11,
        "10^-3": 14.3,
        "10^-4": 16,
        "10^-5": 17.4,
        "10^-6": 18.5,
        "10^-7": 19.2
    }
};

function clearAllFields() {
    document.getElementById('pathLoss').value = '';
    document.getElementById('transmitGain').value = '';
    document.getElementById('receiveGain').value = '';
    document.getElementById('dataRate').value = '';
    document.getElementById('lineLoss').value = '';
    document.getElementById('otherLoss').value = '';
    document.getElementById('fadeMargin').value = '';
    document.getElementById('ampGain').value = '';
    document.getElementById('transAmpGain').value = '';
    document.getElementById('noiseFigure').value = '';
    document.getElementById('temperature').value = '';
    document.getElementById('linkMargin').value = '';
    document.getElementById('normalValue').value = '';
    document.getElementById('convertedDbValue').value = '';
    hideResults();
}

function hideResults() {
    const results = document.getElementsByClassName('result-item');
    for (let result of results) {
        result.style.display = 'none';
    }
}

function convertToDb() {
    const normalValue = parseFloat(document.getElementById('normalValue').value);
    const dbValue = 10 * Math.log10(normalValue);
    document.getElementById('convertedDbValue').value = dbValue.toFixed(2);
}

function calculatePt() {
    const modulationType = document.getElementById('modulationType').value;
    const berValue = document.getElementById('berValue').value;
    const pathLoss = parseFloat(document.getElementById('pathLoss').value);
    const transmitGain = parseFloat(document.getElementById('transmitGain').value);
    const receiveGain = parseFloat(document.getElementById('receiveGain').value);
    const dataRate = parseFloat(document.getElementById('dataRate').value);
    const lineLoss = parseFloat(document.getElementById('lineLoss').value);
    const otherLoss = parseFloat(document.getElementById('otherLoss').value);
    const fadeMargin = parseFloat(document.getElementById('fadeMargin').value);
    const ampGain = parseFloat(document.getElementById('ampGain').value);
    const transAmpGain = parseFloat(document.getElementById('transAmpGain').value);
    const noiseFigure = parseFloat(document.getElementById('noiseFigure').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const linkMargin = parseFloat(document.getElementById('linkMargin').value);
    
    const ebNo = ebNoTable[modulationType][berValue];

    const pr = linkMargin + (-228.6) + temperature + noiseFigure + dataRate + ebNo;
    const pt = pr + pathLoss + lineLoss + otherLoss + fadeMargin - transmitGain - receiveGain - transAmpGain - ampGain;

    const ptWatts = Math.pow(10, pt / 10);

    displayResult('resultPt', `Total Transmit Power (Pt): ${pt.toFixed(2)} dB and ${ptWatts.toFixed(6)} W`);
}

function displayResult(elementId, resultText) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<p>${resultText}</p>`;
}

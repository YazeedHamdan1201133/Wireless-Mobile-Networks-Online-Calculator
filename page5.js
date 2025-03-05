document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    let ReferenceDistance = parseFloat(document.getElementById('ReferenceDistance').value);
    let powerAtRefDistance = parseFloat(document.getElementById('powerAtRefDistance').value);
    let pathLossExponent = parseInt(document.getElementById('pathLossExponent').value);
    let receiverSensitivity = parseFloat(document.getElementById('receiverSensitivity').value);
    let totalArea = parseFloat(document.getElementById('TotalArea').value);
    let AverageCallDuration = parseFloat(document.getElementById('AverageCallDuration').value);
    let AverageCallsPerDay = parseFloat(document.getElementById('AverageCallsPerDay').value);
    let TotalNumberOfUsers = parseFloat(document.getElementById('TotalNumberOfUsers').value);
    let SIR = parseFloat(document.getElementById('SIR').value);
    let calldropprobability = parseFloat(document.getElementById('calldropprobability').value);
    let timeslotsPerCarrier = parseFloat(document.getElementById('timeslotsPerCarrier').value);

    // check the units of the values entered
    const ReferenceDistanceUnit = document.getElementById('ReferenceDistanceUnit').value;
    const powerAtRefDistanceUnit = document.getElementById('powerAtRefDistanceUnit').value;
    const receiverSensitivityUnit = document.getElementById('receiverSensitivityUnit').value;
    const totalAreaUnit = document.getElementById('TotalAreaUnit').value;

    // if unit is not dB check if power non-negative
    if (powerAtRefDistanceUnit !== 'dB' && powerAtRefDistance < 0) {
        alert('Please enter a non-negative value for power');
        resetForm();
        return;
    }

    // if unit is not dB check if receiver sensitivity non-negative
    if (receiverSensitivityUnit !== 'dB' && receiverSensitivity < 0) {
        alert('Please enter a non-negative value for receiver sensitivity');
        resetForm();
        return;
    }

    // check if distance is non-negative
    if (ReferenceDistance < 0) {
        alert('Please enter a non-negative value for distance');
        resetForm();
        return;
    }
    if (isNaN(ReferenceDistance) || isNaN(powerAtRefDistance) || isNaN(pathLossExponent) || isNaN(receiverSensitivity)) {
        alert('Please enter valid values for all fields');
        resetForm();
        return;
    }

    if (ReferenceDistance === 0 || powerAtRefDistance === 0 || pathLossExponent === 0 || receiverSensitivity === 0) {
        alert('Please enter non-zero values for all fields');
        resetForm();
        return;
    }

    ReferenceDistance = convertDistanceUnit(ReferenceDistanceUnit, ReferenceDistance);
    powerAtRefDistance = convertPowerUnit(powerAtRefDistanceUnit, powerAtRefDistance);
    receiverSensitivity = convertPowerUnit(receiverSensitivityUnit, receiverSensitivity);
    totalArea = convertAreaUnit(totalAreaUnit, totalArea);

    // Calculate throughput based on your formula
    let maxDistance = calculateMaxDistance(ReferenceDistance, powerAtRefDistance, pathLossExponent, receiverSensitivity);
    let cellSize = calculateCellSize(maxDistance);
    document.getElementById('results').style.display = 'block';

    let numberOfCells = calculateNumberOfCells(totalArea, cellSize);
    let TrafficLoad = calculateTrafficLoad(AverageCallDuration, AverageCallsPerDay, TotalNumberOfUsers);
    let TrafficLoadPerCell = calculateTrafficLoadPerCell(TrafficLoad, numberOfCells);
    let ceilValue = calculateNumberOfCellsPerCluster(SIR, pathLossExponent);
    calculateNumberOfCarriers(calldropprobability, TrafficLoadPerCell, timeslotsPerCarrier, ceilValue);
});

// function to reset the form
function resetForm() {
    document.getElementById('calcForm').reset();
    document.getElementById('results').style.display = 'none'; // hide results on reset
}

// function to do the calculation
function calculateMaxDistance(ReferenceDistance, powerAtRefDistance, pathLossExponent, receiverSensitivity) {
    let maxDistance = ReferenceDistance / Math.pow(receiverSensitivity / powerAtRefDistance, 1 / pathLossExponent);
    document.getElementById('resultMaxDistance').textContent = maxDistance.toFixed(4) + " meters";
    return maxDistance;
}

// function to calculate the number of cells in the service area
function calculateNumberOfCells(totalArea, cellSize) {
    let numberOfCells = Math.ceil(totalArea / cellSize);
    document.getElementById('resultNumCells').textContent = numberOfCells.toFixed(0); // Adjusted to show as an integer
    return numberOfCells;
}

function convertDistanceUnit(unit, value) {
    if (unit === 'Mega') {
        // convert to meters
        return value * 1000000;
    } else if (unit === 'kilometers') {
        // convert to meters
        return value * 1000;
    } else if (unit === 'meters') {
        // convert to meters
        return value;
    }
}

function convertPowerUnit(unit, value) {
    if (unit === 'dB') {
        // convert to watts
        return Math.pow(10, value / 10);
    } else if (unit === 'watts') {
        // convert to watts
        return value;
    } else if (unit === 'milliwatts') {
        // convert to watts
        return value / 1000;
    } else if (unit === 'microwatts') {
        // convert to watts
        return value / 1000000;
    }
}

function calculateCellSize(maxDistance) {
    let cellSize = (Math.sqrt(3) * 3 / 2) * Math.pow(maxDistance, 2);
    document.getElementById('resultMaxCellSize').textContent = cellSize.toFixed(4) + " meters^2";
    return cellSize;
}

// function to convert the units for area
function convertAreaUnit(unit, value) {
    if (unit === 'm^2') {
        // convert to meters
        return value;
    } else if (unit === 'Km^2') {
        // convert to meters
        return value * 1000000;
    }
}

// function to calculate traffic load in the whole cellular system in Erlangs
function calculateTrafficLoad(AverageCallDuration, AverageCallsPerDay, TotalNumberOfUsers) {
    let TrafficLoad = ((AverageCallDuration * AverageCallsPerDay) / (24 * 60)) * TotalNumberOfUsers;
    document.getElementById('resultTotalTraffic').textContent = TrafficLoad.toFixed(4) + " Erlangs";
    return TrafficLoad;
}

// function to calculate traffic load in each cell in Erlangs
function calculateTrafficLoadPerCell(TrafficLoad, numberOfCells) {
    let TrafficLoadPerCell = TrafficLoad / numberOfCells;
    document.getElementById('resultCellTraffic').textContent = TrafficLoadPerCell.toFixed(4) + " Erlangs";
    return TrafficLoadPerCell;
}

// function to calculate the number of cells in each cluster
function calculateNumberOfCellsPerCluster(SIR, pathLossExponent) {
    SIR = Math.pow(10, SIR / 10);
    let numberOfCellsPerCluster = (1 / 3) * Math.pow(SIR * 6, 2 / pathLossExponent);
    let ceilValue = Math.ceil(numberOfCellsPerCluster);

    while (!isValidClusterSize(ceilValue)) {
        ceilValue++;
    }

    document.getElementById('resultNumCellsInCluster').textContent = ceilValue.toFixed(4);
    return ceilValue;
}

function isValidClusterSize(n) {
    for (let i = 0; i <= Math.sqrt(n); i++) {
        for (let j = 0; j <= Math.sqrt(n); j++) {
            if ((i * i + 2 * j + j * j) === n) {
                return true;
            }
        }
    }
    return false;
}

// function to calculate the minimum number of carriers needed to achieve the required quality of service
function calculateNumberOfCarriers(calldropprobability, TrafficLoadPerCell, timeslotsPerCarrier, ceilValue) {
    const erlangBTable = {
        "0.1%": [0.001, 0.046, 0.194, 0.439, 0.762, 1.100, 1.600, 2.100, 2.600, 3.100, 3.700,
             4.200, 4.800, 5.400, 6.100, 6.700, 7.400, 8.000, 8.700, 9.400, 10.100,
              10.800, 11.500, 12.200, 13.000, 13.700, 14.400, 15.200, 15.900, 16.700,
               17.400, 18.200, 19.000, 19.700, 20.500, 21.300, 22.100, 22.900, 23.700,
                24.400, 25.200, 26.000, 26.800, 27.600, 28.400],
        "0.2%": [0.002, 0.065, 0.249, 0.535, 0.900, 1.300, 1.800, 
            2.300, 2.900, 3.400, 4.000, 4.600, 5.300, 5.900, 6.600, 
            7.300, 7.900, 8.600, 9.400, 10.100, 10.800, 11.500, 12.300,
             13.000, 13.800, 14.500, 15.300, 16.100, 16.800, 17.600, 18.400,
              19.200, 20.000, 20.800, 21.600, 22.400, 23.200, 24.000, 24.800, 25.600,
               26.400, 27.200, 28.100, 28.900, 29.7],
        "0.5%": [0.005, 0.105, 0.349, 0.701, 1.132, 1.600, 2.200, 2.700,
             3.300, 4.000, 4.600, 5.300, 6.000, 6.700, 7.400, 8.100, 8.800, 
             9.600, 10.300, 11.100, 11.900, 12.600, 13.400, 14.200, 15.000, 15.800,
              16.600, 17.400, 18.200, 19.000, 19.900, 20.700, 21.500, 22.300, 23.200,
               24.000, 24.800, 25.700, 26.500, 27.400, 28.200, 29.100, 29.900, 30.800, 31.7],
        "1%": [0.010, 0.153, 0.455, 0.869, 1.361, 1.900, 2.500, 3.100, 3.800, 4.500, 5.200,
            5.900, 6.600, 7.400, 8.100, 8.900, 9.700, 10.400, 11.200, 12.000, 12.800, 13.700,
             14.500, 15.300, 16.100, 17.000, 17.800, 18.600, 19.500, 20.300, 21.200, 22.000, 22.900,
              23.800, 24.600, 25.500, 26.400, 27.300, 28.100, 29.000, 29.900, 30.800, 31.700, 32.500, 33.4],
        "1.2%": [0.012, 0.168, 0.489, 0.922, 1.431, 2.000, 2.600, 3.200, 3.900, 
            4.600, 5.300, 6.100, 6.800, 7.600, 8.300, 9.100, 9.900, 10.700, 11.500,
             12.300, 13.100, 14.000, 14.800, 15.600, 16.500, 17.300, 18.200, 19.000,
              19.900, 20.700, 21.600, 22.500, 23.300, 24.200, 25.100, 26.000, 26.800,
               27.700, 28.600, 29.500, 30.400, 31.300, 32.200, 33.100, 34.000],
        "1.3%": [0.013, 0.176, 0.505, 0.946, 1.464, 2.000, 2.700, 3.300, 4.000,
             4.700, 5.400, 6.100, 6.900, 7.700, 8.400, 9.200, 10.000, 10.800, 
             11.600, 12.400, 13.300, 14.100, 14.900, 15.800, 16.600, 17.500, 
             18.300, 19.200, 20.000, 20.900, 21.800, 22.600, 23.500, 24.400, 
             25.300, 26.200, 27.000, 27.900, 28.800, 29.700, 30.600, 31.500,
              32.400, 33.300, 34.200],
        "1.5%": [0.020, 0.190, 0.530, 0.990, 1.520, 2.100, 2.700, 3.400, 4.100, 
            4.800, 5.500, 6.300, 7.000, 7.800, 8.600, 9.400, 10.200, 11.000, 11.800,
             12.600, 13.500, 14.300, 15.200, 16.000, 16.900, 17.700, 18.600, 19.500,
              20.300, 21.200, 22.100, 22.900, 23.800, 24.700, 25.600, 26.500, 27.400,
               28.300, 29.200, 30.100, 31.000, 31.900, 32.800, 33.700, 34.600],
        "2%": [0.020, 0.223, 0.602, 1.092, 1.657, 2.300, 2.900, 3.600, 4.300, 5.100,
             5.800, 6.600, 7.400, 8.200, 9.000, 9.800, 10.700, 11.500, 12.300, 13.200, 
             14.000, 14.900, 15.800, 16.600, 17.500, 18.400, 19.300, 20.200, 21.000, 21.900,
              22.800, 23.700, 24.600, 25.500, 26.400, 27.300, 28.300, 29.200, 30.100, 31.000, 
              31.900, 32.800, 33.800, 34.700, 35.600],
        "3%": [0.031, 0.282, 0.715, 1.259, 1.875, 2.500, 3.200, 4.000, 4.700, 5.500,
             6.300, 7.100, 8.000, 8.800, 9.600, 10.500, 11.400, 12.200, 13.100, 14.000,
              14.900, 15.800, 16.700, 17.600, 18.500, 19.400, 20.300, 21.200, 22.100, 23.100,
               24.000, 24.900, 25.800, 26.800, 27.700, 28.600, 29.600, 30.500, 31.500, 32.400,
                33.400, 34.300, 35.300, 36.200, 37.200],
        "5%": [0.053, 0.381, 0.899, 1.525, 2.218, 3.000, 3.700, 4.500, 5.400, 6.200,
             7.100, 8.000, 8.800, 9.700, 10.600, 11.500, 12.500, 13.400, 14.300, 15.200,
              16.200, 17.100, 18.100, 19.000, 20.000, 20.900, 21.900, 22.900, 23.800,
               24.800, 25.800, 26.700, 27.700, 28.700, 29.700, 30.700, 31.600, 32.600,
                33.600, 34.600, 35.600, 36.600, 37.600, 38.600, 39.600],
        "7%": [0.075, 0.470, 1.057, 1.748, 2.504, 3.300, 4.100, 5.000, 5.900, 6.800,
             7.700, 8.600, 9.500, 10.500, 11.400, 12.400, 13.400, 14.300, 15.300, 16.300,
              17.300, 18.200, 19.200, 20.200, 21.200, 22.200, 23.200, 24.200, 25.200, 26.200,
               27.200, 28.200, 29.300, 30.300, 31.300, 32.300, 33.300, 34.400, 35.400, 36.400,
                37.400, 38.400, 39.500, 40.500, 41.500],
        "10%": [0.111, 0.595, 1.271, 2.045, 2.881, 3.800, 4.700, 5.600, 6.500, 7.500, 
            8.500, 9.500, 10.500, 11.500, 12.500, 13.500, 14.500, 15.500, 16.600, 17.600,
             18.700, 19.700, 20.700, 21.800, 22.800, 23.900, 24.900, 26.000, 27.100, 28.100, 
             29.200, 30.200, 31.300, 32.400, 33.400, 34.500, 35.600, 36.600, 37.700, 38.800,
              39.900, 40.900, 42.000, 43.100, 44.200],
        "15%": [0.176, 0.796, 1.602, 2.501, 3.454, 4.400, 5.500, 6.500, 7.600, 8.600, 9.700,
             10.800, 11.900, 13.000, 14.100, 15.200, 16.300, 17.400, 18.500, 19.600, 20.800,
              21.900, 23.000, 24.200, 25.300, 26.400, 27.600, 28.700, 29.900, 31.000, 32.100,
               33.300, 34.400, 35.600, 36.700, 37.900, 39.000, 40.200, 41.300, 42.500, 43.600,
                44.800, 45.900, 47.100, 48.200],
        "20%": [0.250, 1.000, 1.930, 2.950, 4.010, 5.100, 6.200, 7.400, 8.500, 9.700, 10.900, 
            12.000, 13.200, 14.400, 15.600, 16.800, 18.000, 19.200, 20.400, 21.600, 22.800, 24.100,
             25.300, 26.500, 27.700, 28.900, 30.200, 31.400, 32.600, 33.800, 35.100, 36.300, 37.500, 
             38.800, 40.000, 41.200, 42.400, 43.700, 44.900, 46.100, 47.400, 48.600, 49.900, 51.100, 52.300],
        "30%": [0.429, 1.450, 2.633, 3.890, 5.189, 6.500, 7.900, 9.200, 10.600, 12.000, 13.300,
             14.700, 16.100, 17.500, 18.900, 20.300, 21.700, 23.100, 24.500, 25.900, 27.300, 28.700,
              30.100, 31.600, 33.000, 34.400, 35.800, 37.200, 38.600, 40.000, 41.500, 42.900, 44.300,
               45.700, 47.100, 48.600, 50.000, 51.400, 52.800, 54.200, 55.700, 57.100, 58.500, 59.900, 61.300]
    };

    let numberOfChannels = findClosestIndex(calldropprobability, TrafficLoadPerCell, erlangBTable) + 1;
    let numberOfCarriersPerCell = Math.ceil(numberOfChannels / timeslotsPerCarrier);
    let numberOfCarriersInWholeSystem = ceilValue * numberOfCarriersPerCell;

    document.getElementById('resultNumChannels').textContent = "Number of Channels: " + numberOfChannels.toFixed(0) 
        + "\nNumber of Carriers Per Cell: " + numberOfCarriersPerCell.toFixed(0) 
        + "\nNumber of Carriers In Whole System: " + numberOfCarriersInWholeSystem.toFixed(0);
}

function findClosestIndex(percentageKey, targetNumber, erlangBTable) {
    percentageKey = percentageKey.toString() + "%";
    const list = erlangBTable[percentageKey];

    // check if list is available
    if (!list) {
        return -1;
    }

    // search in the list to find the first value greater than the target number or equal to it
    let closestIndex = 0;
    
    for (let i = 0; i < list.length; i++) {
        if (list[i] >= targetNumber) {
            closestIndex = i;
            break;
        }
    }

   return closestIndex;
}
function clearAllFields() {
    document.getElementById('calcForm').reset();
    document.getElementById('results').style.display = 'none';
    document.getElementById('resultMaxDistance').textContent = '';
    document.getElementById('resultMaxCellSize').textContent = '';
    document.getElementById('resultNumCells').textContent = '';
    document.getElementById('resultTotalTraffic').textContent = '';
    document.getElementById('resultCellTraffic').textContent = '';
    document.getElementById('resultNumCellsInCluster').textContent = '';
    document.getElementById('resultNumChannels').textContent = '';
}

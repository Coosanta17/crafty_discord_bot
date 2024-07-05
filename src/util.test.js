function compareCommandArrays(arr1, arr2) { // Returns true if the two arrays are equal, false otherwise.
    // Convert arr2 to a map for easier comparison.
    const map = new Map();
    arr2.forEach(item => {
        map.set(item.name, item.description);
    });

    // Iterate over arr1 and check if the corresponding name and description match in arr2.
    for (const item of arr1) {
        const description = map.get(item.name);
        if (description !== item.description) {
            return false;
        }
    }
    return true;
}

// Test case 1: Arrays are equal
const arr1 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr2 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
console.log('1.', compareCommandArrays(arr1, arr2)); // Expected output: true

// Test case 2: Empty arrays
const arr11 = [];
const arr12 = [];
console.log('2.', compareCommandArrays(arr11, arr12)); // Expected output: true

// Test case 3: Arrays have different order
const arr15 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr16 = [
    { name: 'command2', description: 'Description 2' },
    { name: 'command1', description: 'Description 1' },
];
console.log('3.', compareCommandArrays(arr15, arr16)); // Expected output: true

// Test case 4: Names are different
const arr7 = [
    { name: 'different command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr8 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
console.log('4.', compareCommandArrays(arr7, arr8)); // Expected output: true

// Line break between true and false results

// Test case 5: Arrays are not equal
const arr3 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr4 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Different description' },
];
console.log('5.', compareCommandArrays(arr3, arr4)); // Expected output: false

// Test case 6: Arrays have different lengths
const arr5 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr6 = [
    { name: 'command1', description: 'Description 1' },
];
console.log('6.', compareCommandArrays(arr5, arr6)); // Expected output: false

// Test case 7: Descriptions are different
const arr9 = [
    { name: 'command1', description: 'DDescription 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr10 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
console.log('7.', compareCommandArrays(arr9, arr10)); // Expected output: false

// Test case 8: One array is empty
const arr13 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr14 = [];
console.log('8.', compareCommandArrays(arr13, arr14)); // Expected output: false

// Test case 9: Arrays have different order and different values
const arr17 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr18 = [
    { name: 'command2', description: 'Description 1' },
    { name: 'command1', description: 'Description 2' },
];
console.log('9.', compareCommandArrays(arr17, arr18)); // Expected output: false

// Test case 10: Name on the second array is different
const arr19 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'command2', description: 'Description 2' },
];
const arr20 = [
    { name: 'command1', description: 'Description 1' },
    { name: 'different command2', description: 'Description 2' },
];
console.log('10.', compareCommandArrays(arr19, arr20)); // Expected output: false

/*
Expected console output:
1. true
2. true
3. true
4. true // something wrong here

5. false
6. false
7. false
8. false
9. false
10. false
*/

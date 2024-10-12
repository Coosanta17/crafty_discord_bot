// Some JavaScript boilerplate (c) Coosanta

import fs from "fs";

// Time libraries:

export function dateTimeToMilliseconds(dateTime) {
    const date = new Date(dateTime);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }

    return date.getTime();
}

export function minutesToMilliseconds(milliseconds) {
    return milliseconds * 60000;
}

const intervals = {};

export function startInterval(callback, intervalTime, intervalID) {
    if (isIntervalRunning(intervalID)) {
        console.error(`Interval "${intervalID}" is already running.`);
        return; // Exit early if interval already declared.
    }

    intervals[intervalID] = setInterval(callback, intervalTime);
    log(`Interval "${intervalID}" started.`);
}

export function stopInterval(intervalID) {
    if (!intervals[intervalID]) {
        console.error(`Interval "${intervalID}" is not currently running.`);
        return; // Exit early if interval not running.
    }

    clearInterval(intervals[intervalID]);
    delete intervals[intervalID];
    log(`Interval "${intervalID}" stopped.`);
}

export function isIntervalRunning(intervalID) {
    return !!intervals[intervalID]; // False if undefined.
}

// JSON libraries:

export async function createJsonFile(filePath, content) {
    log(`Writing JSON file to ${filePath}...`);
    try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 4), "utf-8");
        log("Success!")
    } catch (error) {
        throw new Error("Error writing JSON file", error);
    }
}

export async function parseJsonFile(filePath){
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function getObjectKeys(object, parentKey){
    let keys = []; 

    if (!object || typeof object !== "object"){
        return keys; // Returns empty keys if not object.
    }

    // If object is an array, iterate over items.
    if (Array.isArray(object)) {
        object.forEach((item, index) => {
            let fullkey = `${parentKey}[${index}]`;
            keys.push(fullkey);
            keys = keys.concat(getObjectKeys(item, fullkey));
        })
        return keys.sort();
    }

    for (let key in object) {
        if (!object.hasOwnProperty(key)) {
            continue; // Skips inherited properties.
        }
        let fullKey = parentKey ? `${parentKey}.${key}` : key;
        keys.push(fullKey);
        keys = keys.concat(getObjectKeys(object[key], fullKey));
    }
    return keys.sort();
}

// Returns true if objects are the same.
export function compareObjects(object1, object2) {
    let keys1 = getObjectKeys(object1);
    let keys2 = getObjectKeys(object2);
    
    if (keys1.length !== keys2.length) {
        return false;
    }

    return keys1.every((key, index) => key === keys2[index]); // Checks if all keys are the same, boolean result.
}

function isValidObject(obj, key) {
    return typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key]);
}

// Recursively merges objects without overwriting existing values from baseObj.
export function mergeObjects(baseObj, newObj) {
    for (const key in newObj) {
        if (!newObj.hasOwnProperty(key)) {
            continue; // Skip inherited properties
        }

        if (isValidObject(newObj, key)) { // The recursive part.
            if (!baseObj.hasOwnProperty(key)) {
                baseObj[key] = {};
            }
            mergeObjects(baseObj[key], newObj[key]);
        }

        if (!baseObj.hasOwnProperty(key)) { 
            // runs only if key doesn"t exist in baseObj.
            baseObj[key] = newObj[key];
        }
    }
    return baseObj;
}

// Miscellaneous:

export function shutDown() {
    log("Shutting down...");
    process.exit();
}

export function addCharacterAtEndOfStringIfMissing(str, char) {
    if (str.endsWith(char)) {
        return str;
    }
    return str + char;
}

export function log(message) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    console.log(`[${time}]: ${message}`);
}

// Debug code below:
/*

log("Hello, world!");

const data1={a:1,b:2,c:{x:9,y:10,z:{zz:[1,2,3,4,5,6,7,8,9]}}};
const data2={a:1,b:2,c:{x:9,y:10,m:12,z:{zz:[1,2,3,4,5,6,7,8,9],yy:[9,8,7,6,5,4,3,2,1]}},d:{f:"Foo",b:"Bar",t:{tt:{ttt:{tttt:7,ttttt:[6,2,7,9,4,2,5,8,9,7,4,2,1,4,7,8,6,4,8,9]}}}}};

mergeJson(data1, data2);
let data1Str = JSON.stringify(data1, null, 4)
let data2Str = JSON.stringify(data2, null, 4)
log("data1: "+data1Str+"\n");
log("data2: "+data2Str);
*/
/*
let obj1 = {a:1,b:{c:2,d:[3,4]},e:4}, obj2 = {a:10,b:{c:20,d:[30,40]},e:40,f:90}, obj3 = {a:1,b:{c:2,d:[3]},e:4};

log(JSON.stringify(obj1, null, 4) + "\n\n~~~~\n\n" + JSON.stringify(obj2, null, 4)+"\n\n~~");
mergeObjects(obj1,obj2);
log("~~\n\n"+JSON.stringify(obj1, null, 4) + "\n\n~~~~\n\n" + JSON.stringify(obj2, null, 4));

log(getObjectKeys(obj2)); // [ "a", "b", "b.c", "b.d", "b.d[0]", "b.d[1]", "e" ]
log(compareObjects(obj1, obj2)); // true
log(compareObjects(obj1, obj3)); // false

log(getObjectKeys(obj1));
*/
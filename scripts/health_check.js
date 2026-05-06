const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    console.log(`Checking ${filePath}...`);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Simple syntax check by wrapping in a function
        new Function(content); 
        console.log(`✅ ${filePath} syntax is valid.`);
        return true;
    } catch (e) {
        console.error(`❌ ${filePath} syntax error: ${e.message}`);
        return false;
    }
}

// Special check for data.js as it must be attached to window
function checkData(filePath) {
    console.log(`Checking ${filePath} data structure...`);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Remove 'window.IELTS_DATA = ' to check if the rest is valid JSON/JS
        const jsonPart = content.replace(/^window\.IELTS_DATA\s*=\s*/, '').replace(/;\s*$/, '');
        JSON.parse(jsonPart);
        console.log(`✅ ${filePath} data structure is valid.`);
        return true;
    } catch (e) {
        // If JSON.parse fails, maybe it's complex JS? 
        // We'll trust the general syntax check for now if it passes checkFile
        return checkFile(filePath);
    }
}

const filesToCheck = [
    'app.js',
    'data/data.js'
];

let allPassed = true;
if (!checkFile('app.js')) allPassed = false;
if (!checkData('data/data.js')) allPassed = false;

if (allPassed) {
    console.log('\n🚀 All systems nominal. Stability Check PASSED.');
    process.exit(0);
} else {
    console.log('\n🚨 Stability Check FAILED. Please fix syntax errors before pushing.');
    process.exit(1);
}

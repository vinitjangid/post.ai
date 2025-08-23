const fs = require('fs');
const path = require('path');

/**
 * Get a random tip from the array of tips, avoiding previously posted ones
 * @param {Array<string>} tips Array of tip strings
 * @param {Set<string>} postedTips Set of already posted tips to avoid duplicates
 * @returns {string} A random tip that hasn't been posted yet
 */
function getRandomTip(tips, postedTips = new Set()) {
    // If we've posted all tips, reset the set
    if (postedTips.size >= tips.length) {
        postedTips.clear();
    }
    
    // Filter out already posted tips
    const availableTips = tips.filter(tip => !postedTips.has(tip));
    
    // Get a random tip from available ones
    const randomIndex = Math.floor(Math.random() * availableTips.length);
    return availableTips[randomIndex];
}

/**
 * Load tips from a JSON file
 * @param {string} filePath Path to the JSON file
 * @returns {Array<string>} Array of tips
 */
function loadTipsFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

module.exports = {
    getRandomTip,
    loadTipsFromFile,
    getTodayDate
};
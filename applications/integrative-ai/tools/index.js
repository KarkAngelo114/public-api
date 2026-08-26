
const fs = require('fs').promises;

/**
 * 
 * @param {Array<Object>} data - array of objects containing key value pairs
 * @returns a string
 */
exports.ObjectArrayToString = (data) => {

    const parsed = [];
    for (let i = 0; i < data.length; i++) {
        const parse = Object.entries(data[i]).map(([key, value]) => `${key}: ${value}`).join(', ');
        parsed.push(parse);
    }
    

    return parsed.join('; \n');
}

/**
 * 
 * @param {String} filepath - loads a markdown file from a specified path 
 */

exports.loadMarkDownFile = async (filepath) => {
    try {
        if (!filepath) {
            throw new Error('"filepath" is undefined.');
        }

        const data = await fs.readFile(filepath,'utf-8');

        console.log(`[INFO]------- Markdown file has been loaded from ${filepath}`);

        return data;

    } catch (e) {

        console.error(e);
        throw e;
    }
}
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

exports.handler = async (event) => {
    try {
        // Path to your XML file
        const filePath = path.resolve(__dirname, '../../data.xml');
        
        // Read the current XML file
        const xmlData = fs.readFileSync(filePath, 'utf8');
        
        // Parse the XML file
        const parser = new xml2js.Parser();
        const xmlObj = await parser.parseStringPromise(xmlData);
        
        // Extract the number of predictions and increment it
        let numberOfPredictions = parseInt(xmlObj.DOCUMENT.NUMBER[0]);
        numberOfPredictions += 1;
        
        // Create a new prediction entry
        const newPrediction = {
            USER: [
                {
                    ID: [numberOfPredictions.toString()],
                    SCORE: [event.queryStringParameters.score],  // Pass the score as a query parameter
                    DATE: [new Date().toISOString()]
                }
            ]
        };
        
        // Add the new prediction to the PRIDICTIONS array
        xmlObj.DOCUMENT.PRIDICTIONS[0].USER.push(newPrediction.USER[0]);
        
        // Update the NUMBER field
        xmlObj.DOCUMENT.NUMBER[0] = numberOfPredictions.toString();
        
        // Convert the modified XML object back to a string
        const builder = new xml2js.Builder();
        const updatedXml = builder.buildObject(xmlObj);
        
        // Write the updated XML back to the file
        fs.writeFileSync(filePath, updatedXml);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'XML updated successfully' })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update XML' })
        };
    }
};

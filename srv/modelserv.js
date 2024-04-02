const cds = require('@sap/cds');
const fs = require('fs');

module.exports = cds.service.impl((srv) => {
    srv.on('appendTextToFile', async (req) => {
        try {
            // Read data from the 'Entity' entity
            const data = await srv.read('Entity');

            // Provide the correct file path
            const filePath = '/home/user/projects/App_Generator/aa.js';

            // Convert data to a string (if needed)
            const formattedData = JSON.stringify(data);

            // Append text to the file
            fs.appendFileSync(filePath, formattedData + '\n'); // Append a newline after each entry

            console.log('Data written to file successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error writing data to file:', error);
            return { success: false };
        }
    });
});

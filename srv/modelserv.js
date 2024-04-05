const cds = require('@sap/cds');
const fs = require('fs');


module.exports = cds.service.impl((srv) => {
    srv.on('appendTextToFile', async (req) => {
        try {
            // Read the value of "rahma" from the request body
            const data = req.data.content;


            // Provide the correct file path
            const filePath = '/home/user/projects/App_Generator/aa.js';
       
            // Write the value of "rahma" to the file
            fs.appendFileSync(filePath, data + '\n'); // Append a newline after each entry


            console.log('Data written to file successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error writing data to file:', error);
            return { success: false };
        }
    });


    srv.after('appendTextToFile', async (data, req, res) => {
        if (res.statusCode === 400) {
            console.error('Error invoking action:', data.error.message);
        } else {
            console.log('Action invoked successfully:', data);
        }
    });
});
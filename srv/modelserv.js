const cds = require('@sap/cds');
const fs = require('fs');
const { exec } = require('child_process'); // Add require statement for child_process

module.exports = cds.service.impl((srv) => {
    srv.on('appendTextToFile', async (req) => {
        try {
            // Read the value of "content" from the request body
            const data = req.data.content;

            // Provide the correct file path
            const filePath = '/home/user/projects/ClientProject/db/schema.cds';
       
            // Write the value of "content" to the file
            fs.appendFileSync(filePath, data + '\n'); // Append a newline after each entry

            console.log('Data written to file successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error writing data to file:', error);
            return { success: false };
        }
    });
    srv.on('appendServiceToFile', async (req) => {
        try {
            // Read the value of "content" from the request body
            const data = req.data.content;

            // Provide the correct file path
            const filePath = '/home/user/projects/ClientProject/srv/modelserv.cds';
       
            // Write the value of "content" to the file
            fs.appendFileSync(filePath, data + '\n'); // Append a newline after each entry

            console.log('Data written to file successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error writing data to file:', error);
            return { success: false };
        }
    });

    srv.on('ExecuteCommand', async (req) => {
        const { command } = req.data;

        try {
            // Execute the terminal command
            const output = await executeTerminalCommand(command);
            return { result: output };
        } catch (error) {
            console.error('Error executing command:', error);
            return error;
        }
    });
   
});

async function executeTerminalCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                reject(error);
            } else {
                console.log(`Command output: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}

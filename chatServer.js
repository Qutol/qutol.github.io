const express = require('express')
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

function addMessage(message) {
    const fs = require('fs');

    const filePath = 'chat.json'; // Replace with your JSON file path
    const newData = { name: 'New Item', value: 123 }; // The new object to append

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        let jsonData = [];
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.warn('File might be empty or invalid JSON, initializing as empty array.');
            jsonData = [];
        }

        // Ensure jsonData is an array before pushing
        if (!Array.isArray(jsonData)) {
            console.warn('Existing JSON is not an array, converting to array.');
            jsonData = [jsonData]; // Wrap non-array content in an array
        }

        console.log(jsonData)

        // 3. Append the new data to the array
        jsonData[0].messages.push(message);

        // 4. Convert the updated array back to a JSON string
        const updatedJsonString = JSON.stringify(jsonData, null, 2); // null, 2 for pretty printing

        // 5. Write the updated JSON string back to the file
        fs.writeFile(filePath, updatedJsonString, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return;
            }
            console.log('Data successfully appended to JSON file.');
        });
    });
}

app.use(cors({
  origin: '*' // Replace with your client-side origin
}));
const port = 50000

app.use(express.json());

app.get('/get', (req, res) => {
  const filePath = path.join(__dirname, 'chat.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to read the file' });
    }
    
    res.json(JSON.parse(data));  // Parse the JSON and send it as a response
  });
});

app.post('/post', (req, res) => {
    const { message } = req.body;
    console.log(req.body)
    res.json({ message: message })
    addMessage(message)
})

app.listen(port, () => {
  console.log(`Chat server listening on port ${port}`)
})
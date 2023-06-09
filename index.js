const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());

// Endpoint to handle JSON input and store the file
// Update the /store-file endpoint in container1/index.js
app.post('/store-file', async (req, res) => {
  const { file, data } = req.body;

  if (!file || !data) {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }

  const filePath = path.join('/Emayan_PV_dir', file);

  try {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(data);
    writeStream.end();

    writeStream.on('finish', () => {
      return res.json({ file, message: 'Success.' });
    });

    writeStream.on('error', (error) => {
      return res
        .status(500)
        .json({ file, error: 'Error while storing the file to the storage.' });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ file, error: 'Error while storing the file to the storage.' });
  }
});


// Define the calculation endpoint
app.post('/calculate', async (req, res) => {
  const { file, product } = req.body;

  if (!file || !product) {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }

  try {
    const response = await axios.post('http://container2-service:7000/calculate', { file, product });
    return res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ file, error: 'File not found.' });
    }

    if (error.response && error.response.status === 200) {
      return res.status(200).json({ file, error: 'Input file not in CSV format.' });
    }

    return res
      .status(500)
      .json({ file, error: 'Error communicating with Container 2.' });
  }
});

const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Container 1 listening on port ${PORT}`);
});

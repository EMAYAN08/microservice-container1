const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;
app.use(express.json());

app.post('/store-file', (req, res) => {
  const { file, content } = req.body;

  if (!file || !content) {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }

  const filePath = path.join('/Emayan_PV_dir', file); // Replace "xxxx" with your first name

  fs.writeFile(filePath, content, (error) => {
    if (error) {
      return res
        .status(500)
        .json({ file, error: 'Error while storing the file to the storage.' });
    }
    return res.json({ file, message: 'Success.' });
  });
});

// Define the calculation endpoint
app.post('/calculate', async (req, res) => {
  const { file, product } = req.body;

  if (!file || !product) {
    return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
  }

  try {
    const response = await axios.post('<CONTAINER2_ENDPOINT>/calculate', { file, product });
    return res.json({ file, sum: response.data.sum });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ file, error: 'File not found.' });
    }
    return res.status(500).json({ file, error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Container 1 listening at http://localhost:${port}`);
});

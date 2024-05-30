const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const upload = multer(); // sets the storage to memory
const app = express();
require('dotenv').config();


app.use(cors({ origin: 'http://localhost:3000' })); // Adjust according to your front-end URL

app.post('/upload-receipt', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const headers = {
        'Authorization': `apikey ${process.env.VERYFI_USERNAME}:${process.env.VERYFI_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Client-Id': process.env.VERYFI_CLIENT_ID,
        'Client-Secret': process.env.VERYFI_CLIENT_SECRET
    };

    const data = {
        file_name: req.file.originalname,
        file_data: req.file.buffer.toString('base64')
    };

    try {
        const veryfiResponse = await axios.post('https://api.veryfi.com/api/v7/partner/documents/', data, { headers });
        res.json(veryfiResponse.data);
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request:', error.request);
        } else {
            // Something else caused an error
            console.error('Error Message:', error.message);
        }
        res.status(500).send('Server error occurred');
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

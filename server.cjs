// server.js
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // frontend origin
}));

// Configure AWS
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: 'us-east-2'
});

const s3 = new AWS.S3();

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  const params = {
    Bucket: 'bucketforsomemedia',
    Key: file.originalname, // you may want to generate a unique name
    Body: file.buffer,
    ACL: 'public-read', // makes the file publicly accessible forever
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file');
    }
    res.json({ url: data.Location });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
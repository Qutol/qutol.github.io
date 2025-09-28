// server.js
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

// Configure AWS
AWS.config.update({
  accessKeyId: "AKIATJUPLDEH3CIPTONY",
  secretAccessKey: "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",
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
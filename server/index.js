import express from 'express';
import multer from 'multer';
import { create } from 'ipfs-http-client';
import cors from 'cors';

const app = express();
const upload = multer();

const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Error('No file uploaded');
    }

    const currentTime = new Date().toISOString();

    console.log('Uploading file to IPFS...');
    const added = await ipfs.add(file.buffer);
    console.log('File uploaded to IPFS:', added);

    res.status(200).json({
      hash: added.path,
      timestamp: currentTime,
      mimetype: 'text/plain',
    });
  } catch (error) {
    console.error('Error uploading file to IPFS:', error.message);
    res.status(500).send(`Error uploading file to IPFS: ${error.message}`);
  }
});

app.get('/download/:hash/:timestamp', async (req, res) => {
  try {
    const { hash, timestamp } = req.params;
    console.log(`Downloading file from IPFS with hash: ${hash}`);

    const fileChunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      fileChunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(fileChunks);
    const filename = `record_${timestamp}.txt`; // Generación de nombres de archivo mediante el tiempo
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error downloading file from IPFS:', error.message);
    res.status(500).send(`Error downloading file from IPFS: ${error.message}`);
  }
});

app.post('/register', async (req, res) => {
  try {
    const { address, role } = req.body;
    const registrationData = { address, role, timestamp: new Date().toISOString() };

    console.log('Uploading registration data to IPFS...');
    const added = await ipfs.add(JSON.stringify(registrationData));
    console.log('Registration data uploaded to IPFS:', added);

    res.status(200).json({ hash: added.path });
  } catch (error) {
    console.error('Error uploading registration data to IPFS:', error.message);
    res.status(500).send(`Error uploading registration data to IPFS: ${error.message}`);
  }
});

app.post('/appointment', async (req, res) => {
  try {
    const { doctorAddress, patientAddress, timestamp } = req.body;
    const appointmentData = { doctorAddress, patientAddress, timestamp, created_at: new Date().toISOString() };

    console.log('Uploading appointment data to IPFS...');
    const added = await ipfs.add(JSON.stringify(appointmentData));
    console.log('Appointment data uploaded to IPFS:', added);

    res.status(200).json({ hash: added.path });
  } catch (error) {
    console.error('Error uploading appointment data to IPFS:', error.message);
    res.status(500).send(`Error uploading appointment data to IPFS: ${error.message}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

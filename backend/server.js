const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Replace with your actual MongoDB URI
const uri = 'mongodb+srv://Vishalathreya07:1234@cluster0.jwe3a1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri)
  .then(() => console.log('MongoDB database connection established successfully'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  purpose: { type: String, required: true },
  host: { type: String, required: true },
  arrival: { type: Date, default: Date.now },
  image: { type: String, required: true } // Ensure image field is included
});

const Visitor = mongoose.model('Visitor', visitorSchema);

app.post('/api/visitors', async (req, res) => {
  console.log('POST /api/visitors request body:', req.body);
  try {
    const visitor = new Visitor(req.body);
    await visitor.save();
    sendEmail(visitor);
    res.status(201).json({ message: 'Visitor added!' });
  } catch (err) {
    console.error('Error adding visitor:', err);
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

app.get('/api/visitors', async (req, res) => {
  console.log('GET /api/visitors request');
  try {
    const visitors = await Visitor.find();
    res.status(200).json(visitors);
  } catch (err) {
    console.error('Error fetching visitors:', err);
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2022it0845@svce.ac.in', // Your Gmail address
    pass: 'Svce@1234'         // Your Gmail password or App password
  }
});

const sendEmail = (visitor) => {
  const mailOptions = {
    from: '2022it0845@svce.ac.in',
    to: visitor.host,
    subject: 'New Visitor Notification',
    html: `
      <h3>New Visitor Details</h3>
      <p><strong>Name:</strong> ${visitor.name}</p>
      <p><strong>Contact:</strong> ${visitor.contact}</p>
      <p><strong>Purpose:</strong> ${visitor.purpose}</p>
      <p><strong>Arrival:</strong> ${visitor.arrival}</p>
      <p><img src="cid:visitorImage" style="width: 200px;" /></p>
    `,
    attachments: [{
      filename: 'visitor.jpg',
      content: visitor.image.split("base64,")[1],
      encoding: 'base64',
      cid: 'visitorImage' // same cid value as in the html img src
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

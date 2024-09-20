// server.js
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const app = express();
app.use(express.json());

app.post('/sendNotification', (req, res) => {
  const { token, message } = req.body;

  const payload = {
    notification: {
      title: 'Location Shared',
      body: message,
    },
  };

  admin.messaging().sendToDevice(token, payload)
    .then(response => {
      res.status(200).send('Notification sent successfully');
    })
    .catch(error => {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification');
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






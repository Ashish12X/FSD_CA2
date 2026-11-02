const express = require('express');
const connectDB = require('./db');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api/feedback', feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

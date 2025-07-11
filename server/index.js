const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/promanage';

// Remove deprecated options
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.log('\nTo fix this issue:');
  console.log('1. Create a .env file in the server directory');
  console.log('2. Add your MongoDB Atlas connection string: MONGO_URI=your_connection_string');
  console.log('3. Whitelist your IP address in MongoDB Atlas');
  console.log('4. Or use a local MongoDB instance');
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ProManage API is running!');
});

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Remove the old app.listen block 
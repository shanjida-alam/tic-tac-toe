require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gamesRouter = require('./routes/games');

const app = express();
app.use(cors(), express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log('MongoDB connected'))
.catch(e => console.error('Mongo error:', e));

app.use('/api/games', gamesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

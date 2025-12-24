const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const router = require('./router/api.js');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-8',
	legacyHeaders: false
})

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(limiter);
app.use('/api',router);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err,req,res,next) => {
    console.error(err);
    res.status(500).json({ message: err.message});
})

app.listen(PORT,()=>console.log("Server listen on http://localhost:8000"));

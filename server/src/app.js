const express = require('express');
require('dotenv').config();


const router = require('./router.js')

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(cors());
app.use(express.json());

app.use('/api',router);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err,req,res,next) => {
    console.error(err);
    res.status(500).json({ message: err.message});
})

app.listen(PORT,()=>"Server listen on http://localhost:8000");

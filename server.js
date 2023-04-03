require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const PORT = process.env.PORT || 3500;


//MONGO DB CONNECTION
dbConnect();


//Middle wares
app.use(bodyParser.json({limit:'30mb', extended: true}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({limit:'30mb', extended: true}));
app.use(
  cors({
    origin: ["http://localhost:3000", 'https://mern-stack-blog-v1-frontend.onrender.com'],
    credentials: true,
  })
);
app.use(express.json());


//Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));


app.listen(PORT, ()=>{
    console.log(`app is running on Port ${PORT}`);
})
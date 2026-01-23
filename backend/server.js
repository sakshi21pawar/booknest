require('dotenv').config(); // load .env into process.env
console.log('process.env.JWT_SECRET:', process.env.JWT_SECRET);


const express = require('express');
const cors= require('cors');
const app=express();


app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("server is running");
});

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);
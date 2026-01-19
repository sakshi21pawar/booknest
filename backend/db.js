require('dotenv').config();

const mysql=require('mysql2');
const dotenv= require('dotenv');



const db=mysql.createPool({
host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'bookstore'
});
module.exports = db;
const app=require('./src/app');
const dns=require("dns");
const connectDB = require('./src/database/db');
//require('dotenv').config();
dns.setServers(['8.8.8.8', '8.8.4.4']);
connectDB();
app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
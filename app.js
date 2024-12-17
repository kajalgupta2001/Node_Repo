const express = require("express");
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api", (req,resp)=>{
    resp.json({message:"welcome to the Api !"})
})
app.listen(PORT, () => {
  console.log(`server is running on the port ${PORT}`);
});

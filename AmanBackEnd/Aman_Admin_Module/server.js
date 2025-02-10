require('dotenv').config({ path: 'E:/TheUnknown/Programming/Aman/AmanBackEnd/Aman_User_Module/.env'});
const express = require('express')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
const port = 3003

app.use(express.json()); // Parses JSON requests
app.use("/admin", adminRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
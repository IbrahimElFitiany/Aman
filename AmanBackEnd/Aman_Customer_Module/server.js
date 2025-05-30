require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const PORT = process.env.APP_PORT;
const app = express();


app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes)
app.use("/user", userRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

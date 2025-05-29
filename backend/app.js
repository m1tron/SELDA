const express = require('express');
const cors = require('cors');
const path = require("path");

// Setup express instance
const app = express();
app.use(cors());
app.use(express.json());

// Host frontend
app.use(express.static(path.join(__dirname, "public")));

// Add routes
app.use(require("./routes/search"));
app.use(require("./routes/webhook"));
app.use(require("./routes/occupations"));

app.listen(3000, () => { console.log('Server running on port 3000') });
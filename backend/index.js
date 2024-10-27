const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

require('./config/passport'); // Import Passport configuration

// Enable CORS with specific frontend origin and credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  // Allow cookies and authorization headers
}));

// Configure sessions middleware
app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to `true` if using HTTPS in production
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((error) => console.log("Error connecting to MongoDB:", error));

// Import and use auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Import and use pdfRoutes for PDF uploads and processing
const pdfRoutes = require('./routes/pdfRoutes');
app.use('/api/pdf', pdfRoutes);


const toJsonRoutes = require('./routes/getJSON');
app.use('/api/toJson', toJsonRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

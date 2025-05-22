const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/bookRoutes'));
app.use('/api', require('./routes/reviewRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Your routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/reviews', reviewRoutes);


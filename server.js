require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the Void (MongoDB)'))
  .catch(err => console.error('Database connection failed:', err));

// Define the GTD Winner Schema
const winnerSchema = new mongoose.Schema({
    xHandle: String,
    evmAddress: String,
    timestamp: { type: Date, default: Date.now },
    verificationHash: String
});

const Winner = mongoose.model('Winner', winnerSchema);

// The API Endpoint to catch the winning payload
app.post('/api/gtd', async (req, res) => {
    try {
        const { handle, address, hash } = req.body;
        
        // Save the new winner to the database
        const newWinner = new Winner({
            xHandle: handle,
            evmAddress: address,
            verificationHash: hash
        });
        
        await newWinner.save();
        res.status(200).json({ message: "Transmission secured." });
    } catch (error) {
        res.status(500).json({ error: "Failed to log anomaly." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
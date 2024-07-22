require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const ehrRoutes = require('./routes/EHRRoutes');
const authenticateToken = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs'
});

app.use('/peerjs', peerServer);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'views')));  // Serve static files from 'views' directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use('/auth', authRoutes);

// EHR routes
app.use('/ehr', ehrRoutes);

// Consultation routes
app.get('/consultation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'consultation', 'index.html'));
});

// Route for authentication page
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth.html'));
});

// Handle WebSocket connections
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

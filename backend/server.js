const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const publicRoutes = require('./routes/publicRoutes');
const errorHandler = require('./middleware/errorHandler');
<<<<<<< HEAD
const mapRoutes = require('./routes/mapRoutes');
const priorityRoutes = require('./routes/priorityRoutes');
const searchRoutes = require('./routes/searchRoutes');
=======
>>>>>>> origin/main

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
<<<<<<< HEAD
  cors: { origin: '*', methods: ['GET', 'POST'] },
=======
  cors: { origin: 'http://localhost:5174', methods: ['GET', 'POST'] },
>>>>>>> origin/main
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/public', publicRoutes);
<<<<<<< HEAD
app.use('/api/map', mapRoutes);
app.use('/api/priority', priorityRoutes);
app.use('/api/search', searchRoutes);


// Anamika's features - Department routes
const departmentRoutes = require('./routes/departments');
app.use('/api/departments', departmentRoutes);

// Anamika's features - Overdue checker
const checkOverdueComplaints = require('./utils/overdueChecker');
checkOverdueComplaints();
setInterval(checkOverdueComplaints, 24 * 60 * 60 * 1000);
=======
>>>>>>> origin/main

app.get('/', (req, res) => res.send('API is running...'));

app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

app.set('io', io);

<<<<<<< HEAD
const PORT = process.env.PORT || 5001;
=======
const PORT = process.env.PORT || 5000;
>>>>>>> origin/main
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
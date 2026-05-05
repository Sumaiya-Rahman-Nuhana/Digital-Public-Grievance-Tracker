const User = require('../models/User');
const jwt = require('jsonwebtoken');

<<<<<<< HEAD
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
=======
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
>>>>>>> origin/main

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const userExists = await User.findOne({ email });
<<<<<<< HEAD
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, phone });
    return res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: generateToken(user._id),
=======
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, phone });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
>>>>>>> origin/main
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
<<<<<<< HEAD
        _id: user._id, name: user.name, email: user.email,
        role: user.role, token: generateToken(user._id),
      });
    }
    return res.status(401).json({ message: 'Invalid email or password' });
=======
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
>>>>>>> origin/main
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
<<<<<<< HEAD
    if (user) return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    return res.status(404).json({ message: 'User not found' });
=======
    if (user) {
      return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
>>>>>>> origin/main
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
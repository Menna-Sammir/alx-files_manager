const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const postNew = async (req, res) => {
  const [email, password] = [req.body.email, req.body.password];
  if (!email) return res.status(400).json({ error: 'Missing email' });
  if (!password) return res.status(400).json({ error: 'Missing password' });
  const user = await dbClient.addUser({ email, password });

  if (user) {
    return res.status(201).json({ id: user.insertedId, email });
  } return res.status(400).json({ error: 'Already exist' });
};

const getMe = async (req, res) => {
  const tokenHeader = req.headers['x-token'];
  const key = `auth_${tokenHeader}`;
  const userId = await redisClient.get(key);
  const user = await dbClient.users.findOne({ _id: ObjectId(userId) });
  if (user) return res.json({ id: user._id, email: user.email });

  return res.status(401).json({ error: 'Unauthorized' });
};

const getDisconnect = async (req, res) => {
  const tokenHeader = req.headers['x-token'];
  const key = `auth_${tokenHeader}`;
  const userId = await redisClient.get(key);
  const user = await dbClient.users.findOne({ _id: ObjectId(userId) });
  if (user) {
    await redisClient.del(key);
    return res.status(204).json();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

module.exports = { postNew, getMe, getDisconnect };

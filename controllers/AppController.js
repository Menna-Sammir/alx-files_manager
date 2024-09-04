const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const getStatus = (req, res) => {
  const liveRedis = redisClient.isAlive();
  const liveDB = dbClient.isAlive();

  res.json({ redis: liveRedis, db: liveDB });
};

const getStats = async (req, res) => {
  const usersCount = await dbClient.nbUsers();
  const filesCount = await dbClient.nbFiles();

  res.json({ users: usersCount, files: filesCount });
};

module.exports = { getStatus, getStats };

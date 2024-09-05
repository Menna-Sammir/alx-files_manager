const express = require('express');
const { getStatus, getStats } = require('../controllers/AppController');
const { postNew, getMe, getDisconnect } = require('../controllers/UsersController');
const { getConnect } = require('../controllers/AuthController');
const postUpload = require('../controllers/FilesController');

const router = express.Router();

router.get('/status', getStatus);
router.get('/stats', getStats);

router.post('/users', postNew);

router.get('/connect', getConnect);
router.get('/users/me', getMe);
router.get('/disconnect', getDisconnect);

router.post('/files', postUpload);

module.exports = router;

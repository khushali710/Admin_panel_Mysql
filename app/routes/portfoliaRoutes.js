const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } =  require('../helpers/auth');
const portfoliaController = require('../controller/portfoliacontroller');
const upload = require('../services/multer');

router.get('/viewportfolia',auth, portfoliaController.portfolia);


router.post('/addtesportfolia',auth,upload.array('uploadImage',12),portfoliaController.addData);
router.post('/editportfolia/:id',auth,upload.single('uploadImage'),portfoliaController.editData);
router.get('/portfoliadelete/:id',auth,portfoliaController.deleteData);
router.get('/api/portfolia/delete',auth,portfoliaController.deleteAll);

module.exports = router;
var express = require('express');
var router = express.Router();
const registerController = require('../controllers/registerController');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST new user's data to the MySQL RDS */
router.post('/', registerController.handleNewUser);


/* POST new user's data to the MySQL RDS */
router.post('/', loginController.handleLogin);

module.exports = router;

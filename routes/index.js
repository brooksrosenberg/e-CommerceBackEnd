const router = require('express').Router();
const apiRoutes = require('./api');
// use routes
router.use('/api', apiRoutes);
// if not send user...
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;
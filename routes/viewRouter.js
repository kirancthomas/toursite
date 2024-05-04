const express = require('express');
const viewController = require('../controller/viewController');


const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('base', {
      tour: 'the forest hiker',
      user: 'Jonas'
    });
  })
  
router.get('/overview',viewController.overView);

  
router.get('/tour', (req, res) => {
    res.status(200).render('tour', {
      title: 'The Forest Hiker Tour'
    })
  })

module.exports = router;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const mysql = require('./mysql_config');
// const commaNumber = require('comma-number');
// const nodemailer = require('nodemailer');
// const format = commaNumber.bindWith(',', '.');
const dotenv = require('dotenv').config({path : './smtp_config.env'});
const TaskManager = require('./TaskManager');
const manager = new TaskManager();
const port = 8080;
// view engine setup
app.set('view engine', 'ejs');

//setting middleware
app.use(express.static('config'));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}));

/**
* get data from database and populate the drop downlist
*/
app.get('/', (req,res) => {
  manager.getAllType(data => {
    let f_type = data
    console.log(f_type);
    res.render('estimate.ejs', {type:f_type, title: 'Bonorum et Malorum', h2:'Lorem Ipsum Calculator'});
    });
  })

/**
* get data and do the calculation
*/
app.post('/estimate_summary', (req, res) => {
  let input_user = req.body
  let input_arr = manager.dataFromUser(input_user);
  manager.getEstimateSummary(input_arr, data => {
    console.log('inside the manager');
    console.log(data);
    manager.calculateEstimate(input_user, data);
    res.send(input_user);
  })
});

/*
*
*/
app.post('/fence-type', (req, res) => {
  let f_type = req.body.name;
  let f_color = {};
  let f_height = {};
  manager.getFenceColor(f_type, data => {
    f_color = data;
    manager.getFenceHeight(f_type, data => {
      f_height = data;
      res.send({'color': f_color, 'height': f_height})
    });
  });
});

/**
* this function is used to send email to customer service
*/
app.post('/contact_us', (req, res) => {
  let data = req.body;
  manager.sendEmail(res, data);
})

// displays a message about the port the app is using
app.listen(port, () => {
    console.log(`I am listening to a port ${port}`);
})

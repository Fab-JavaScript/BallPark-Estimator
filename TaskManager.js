const mysql = require('./mysql_config');
const commaNumber = require('comma-number');
const nodemailer = require('nodemailer');
const format = commaNumber.bindWith(',', '.');

/*
*
*/
let sql;
class TaskManager {
  // execute different query
  runSQL(sql, params, callback) {
    let connection = mysql.getConnection();
    connection.query(sql, params, (err, data) => {
      if (err) throw err;
      callback(data);
    })
  }
  /*
  * this get all fence type
  */
  getAllType(callback) {
    sql ='SELECT distinct fence_Type from fence_estimator';
    this.runSQL(sql, undefined, callback);
  }
  /**
  * this function get all data from the client
  * then send to the server
  */
  getEstimateSummary(input_arr, callback) {
    console.log('what is in input_arr');
   // sql call
   sql ='SELECT fence_price from fence_estimator where fence_type =? and fence_height=? and fence_color =?';
   this.runSQL(sql, input_arr, callback);
   console.log(input_arr);
  }
  /*
  *
  */
  dataFromUser(input_user){
    // getting the value that the user enter
    let input_type = input_user.type
    let input_height = input_user.height
    let input_color = input_user.color
    let fence_arr = [input_type, input_height, input_color]
    return fence_arr;
  }
  /*
  *
  */
  calculateEstimate(input_user, data) {

    const misc_charge = 275;
    const pvc_single = 450.00;
    const pvc_double = 900.00;

    const aluminum_single = 375.00;
    const aluminum_double = 750.00;

    const wood_single = 300.00;
    const wood_double = 600.00;

    let price_perFoot = data[0].fence_price;
    let price = (price_perFoot * input_user.footage) + misc_charge ;
    let f_single = 0;
    let f_double = 0;
    let total = 0;
    let foot_price = 0;
    //
    switch (input_user.type) {
      case 'PVC Privacy':
      case 'PVC Semi-Private':
      f_single = input_user.single * pvc_single
      f_double = input_user.double * pvc_double
      break;
      case 'Aluminum':
      f_single = input_user.single * aluminum_single
      f_double = input_user.double * aluminum_double
      break;
      case 'Solid Style Wood':
        case 'Shadowbox Style Wood':
      f_single = input_user.single *  wood_single
      f_double = input_user.double *  wood_double
      break;
    }
    // checking footage range that will determine the added cost
    if(input_user.footage < 50)
    foot_price =  350;
    else if(input_user.footage < 100 )
    foot_price = 250;
    else if(input_user.footage < 150 )
    foot_price = 150;
    else if(input_user.footage < 200 )
    foot_price = 50;
    else if(input_user.footage < 250 )
    foot_price = 0;
    else if(input_user.footage < 300 )
    foot_price = (input_user.footage) * (- 0.5);
    else if(input_user.footage < 400 )
    foot_price = (input_user.footage) * (- 0.75);
    else if(input_user.footage >= 400 )
    foot_price = (input_user.footage) * (- 1);

    total = price + f_single + f_double + foot_price;
    total = total.toFixed(2);
    let format_total = format(total);
    console.log(input_user);
    // this will create an object key and its value
    input_user['total'] = format_total;
    console.log(input_user);

  }
  /*
  * this function get the color of the selected fence typ
  */
  getFenceColor(fence_type, callback) {
    sql = "SELECT distinct fence_color from fence_estimator where fence_type = ?";
    this.runSQL(sql, [fence_type], callback);
  }
  /*
  * this function get the height of the selected fence typ
  */
  getFenceHeight(fence_type, callback) {
    sql = 'SELECT distinct fence_height from fence_estimator where fence_type = ?';
    this.runSQL(sql, [fence_type], callback);
  }

  /**
   * this function will send email
   */

  sendEmail(res, data) {
    // this check the addition
    if(!this.checkCaptcha(data.captcha.num1, data.captcha.num2, data.captcha_answer)) {
      res.send({'success': false, 'message': "Incorrect captcha!"});
      return false;
    } else if(data.captcha_answer == '' || data.captcha_answer == null ) {
      res.send({'success': false, 'message': "Incorrect captcha!"});
      return false;
    }
    //
    let estimateObj = data.estimate;
    console.log(data);
    let str = `Materials selected :
      Fence Type:\t${estimateObj.type}
      Fence Height:\t${estimateObj.height}
      Fence Footage:\t${estimateObj.footage}
      Fence Color:\t${estimateObj.color}
      Number Of Single Gates:\t${estimateObj.single}
      Number of Double Gates:\t${estimateObj.double}
      Estimate:\t$${estimateObj.total}\n`;

    let contact_info = `Contact information :
      Customer Name:\t${data.name}
      Email:\t${data.email}
      Phone Number:\t${data.phone}
      Address:\t${data.address}
      City:\t${data.city}
      Zip Code:\t${data.zipcode}\n`;

    // setting up the tranporter and instantiate the transporter
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PWD
      }
    });
    // // declaring an array of recipients . kbros recipient Inqu1ry@kbrothersfence.com
    // let recipients = ['-----']
    let mailOptions = {
      from: `${data.email}`,
      to: 'fabrice@hungry4more.learn',
      // bcc: recipients,
      subject: `Ballpark Estimate requested from ${data.name}`,
      text: `${contact_info} \n${str} \nMessage or Comment : \n${data.message}`
    };
    //transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send({'success': false, 'message': 'Email was not sent'});
      } else {
        res.send({'success': true, 'message': "Email successfully sent"});
        console.log("Email successfully sent to recipient!");
      }
    });
  }

  /**
   * this func return the addition with the result
   */
  checkCaptcha(num1, num2, ans) {
    return num1 + num2 == ans;
  }
}

module.exports = TaskManager;

const mysql = require("mysql");
const dotenv = require('dotenv').config({path : './smtp_config.env'});

const getConnection = () => {
    let connection = mysql.createConnection({
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PWD,
      database : process.env.DB_NAME,
      port     : process.env.DB_PORT,
    });
    connection.connect(error => {
        if(error) throw error;
        console.log("mySql has successfully connected....");
    })
    return connection;
}

exports.getConnection = getConnection;

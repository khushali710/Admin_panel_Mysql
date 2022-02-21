const bcrypt = require('bcrypt')
const {validateForm, logingForm,forgotpass,newpassword,changepassword,editProfile} = require('../validations/userValidation');
const logger = require('../logger/logger');
const { sendOTP }  = require('../services/mail');
const { response } = require('express');
const auth = require('../helpers/auth');
const connection = require('../helpers/db');
var otp = Math.floor(100000 + Math.random() * 900000);


exports.register = async(req,res)=>{
    try{
        const { error } = validateForm(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
         else{
            const salt = await bcrypt.genSalt(10);
            const bycryptpassword = await bcrypt.hash(req.body.password, salt);
             
            const name = req.body.name;
            const email = req.body.email;
            const gender = req.body.gender;
            const phoneno = req.body.phoneno;
            const password = bycryptpassword;
            const uploadImage = req.file.filename;
            const city = req.body.city;
            const hobby = req.body.hobby
            const sql = `INSERT INTO tb_khushali(name,email,gender,phoneno,password,uploadImage,city,hobby) VALUES('${name}','${email}','${gender}','${phoneno}','${password}','${uploadImage}','${city}','${hobby}')`;
            connection.query(sql, (err, result) => {
                if (result) {
                     res.send("Data Inserted...")
                      
                    } else {
                        logger.error('Error', err);
                        console.log("khgb");  
                    }
                })
            }
        }
    
    catch(err){
        logger.error('error',err);
    }
}

exports.loging = async(req,res)=>{

    try {
        const { error } = logingForm(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {

            var email = req.body.email;
            var password = req.body.password;
            connection.query('SELECT * FROM tb_khushali WHERE email = ?', [email], async function (error, results, fields) {
                if (error) {
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                    if (results.length > 0) {
                        const comparision = await bcrypt.compare(password, results[0].password)
                        if (comparision) {
                            res.send({

                                "success": "login successfully"
                            })
                        }
                        else {
                            res.send({

                                "success": "Email and password does not match"
                            })
                        }
                    }
                    else {
                        res.send({

                            "success": "Email does not exits"
                        });
                    }
                }
            });

        }

    } catch (err) {
        logger.error('Error', err);
    }
}
     exports.forgotpass = async(req,res)=> {
        try {
            const { error } = forgotpass(req.body);
            if (error) {
                return res.status(400).send(error.details[0].message);
            } else {
                const email = req.body.email;
                connection.query('SELECT * FROM tb_khushali WHERE email = ?', [email], async (error, result) => {
                    if (result) {
                        sendOTP(email, otp);
                        res.send('OTP send');
                    }
                    else {
                        res.send('user not found')
                    }
                })
            }
    
        } catch (err) {
            logger.error('Error', err);
        }
    }
     exports.verifyOtp = (req, res) => {
        try {
            if (otp == req.body.otp) {
                res.send('verify otp')
            }
            else {
                
                 res.send('plz enter valid otp')
            }
        } catch (err) {
            logger.error('Error', err);
        }
    }
    exports.updatepass = async(req,res)=>{
        try{
            const {error} = newpassword(req.body);
            if(error) {
                return res.status(400).send(error.details[0].message);
            }
            const password = req.body.password;
            
            connection.query('SELECT password FROM tb_khushali  WHERE email=?', [email], async (err, results) => {
                if (results) {
                    const validPassword = await bcrypt.compare(password, results[0].password);

                    if (validPassword) {

                        const newpassword = req.body.newpassword;
                        const salt = await bcrypt.genSalt(10);
                        const bcryptpassword = await bcrypt.hash(newpassword, salt);

                        console.log(bcryptpassword);
                        connection.query(`UPDATE tb_khushali SET password = ? WHERE email =?`, [bcryptpassword, email], (err, response) => {

                            if (response) {
                                res.send('password updated')
                            } else {
                                logger.error('Error', err);
                            }
                        })
                    } else {
                        res.send('password is incorrect')
                    }
                } else {
                    logger.error('Error', err);
                }
            })
        }

         catch(err){
            logger.error('Error',err);
        }
    }
    exports.changepassword = async(req, res) =>{
        // console.log(req.body);
        try {
            const { error } = changepassword(req.body);
            if (error) {
                return res.status(400).send(error.details[0].message);
            } else {
    
                const password = req.body.oldpassword;
                const email = req.user.email
                console.log(email);
                connection.query('SELECT password FROM tb_khushali  WHERE email=?', [email], async (err, result) => {
                    if (result) {
    
                        console.log(result[0].password);
                        const validPassword = await bcrypt.compare(password, result[0].password);
    
                        if (validPassword) {
    
                            const newpassword = req.body.password;
                            const salt = await bcrypt.genSalt(10);
                            const bcryptpassword = await bcrypt.hash(newpassword, salt);
    
                            console.log(bcryptpassword);
                            connection.query(`UPDATE tb_khushali SET password = ? WHERE email =?`, [bcryptpassword, email], (err, response) => {
    
                                if (response) {
                                    res.send('password updated')
                                } else {
                                    logger.error('Error', err);
                                }
                            })
                        } else {
                            res.send('password is incorrect')
                        }
                    } else {
                        logger.error('Error', err);
                    }
                })
            }
    
        } catch (err) {
            logger.error('Error', err);
        }
    
}
exports.viewProfile = async (req, res) => {
    try {
        const email = req.user.email
        console.log(email);
        connection.query(`SELECT * FROM tb_khushali WHERE email=?`, [email], (err, result) => {
            if (result) {
                res.send(result);
            } else {
                logger.error('Error', err);
            }
        })
        } catch (err) {
            logger.error(err);
        }
}
exports.editProfile = async (req, res) => {

    try {
        const { error } = editProfile(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const name = req.body.name;
            const email = req.body.email;
            const gender = req.body.gender;
            const phoneno = req.body.phoneno;
            const uploadImage = req.file.filename;
            const city = req.body.city
            const hobby = req.body.hobby
            connection.query(`UPDATE tb_khushali SET name='${name}', email='${email}', gender='${gender}', phoneno = '${phoneno}',uploadImage='${uploadImage}', city='${city}',hobby='${hobby}' WHERE email ='${req.user.email}'`, function (err, response) {

                if (response) {
                    res.send('Data updated')
                } else {
                    logger.error('Error', err);
                }
            })
        }
    } catch (err) {
        logger.error('Error', err);
    }
    }
   
exports.logout = async(req, res) => {
    try {
        res.clearCookie("jwt");
        res.send('logout');
    }
  catch (err) {
        logger.error(err);
    }
}
    
            
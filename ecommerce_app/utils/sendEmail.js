const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'pooja.wangoes@gmail.com',
                pass: 'tttocibpyeyseezn'
            }
        };
        var html = '<h2 style="text-align: center;">Forgot Password</h2>\
        <p style="text-align: center;">Hi '+email+',</p>\
        <p style="text-align: center;">Please <a href="'+text+'">click here</a> to reset your password</p>\
        <h4 style="text-align: center;">Thankyou</h4>'
        var transporter = nodemailer.createTransport(smtpConfig);
        await transporter.sendMail({
            from: "pooja.wangoes@gmail.com",
            to: email,
            subject: subject,
            html: html
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

const sendOtp = async (email, subject, otp) => {
    try {
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'pooja.wangoes@gmail.com',
                pass: 'tttocibpyeyseezn'
            }
        };

        var html = '<h2 style="text-align: center;">Email Verification</h2>\
        <p style="text-align: center;">Hi '+email+',</p>\
        <p style="text-align: center;">Please confirm your email by providing this OTP <b>'+otp+'</b></p>\
        <h4 style="text-align: center;">Thankyou</h4>'
        var transporter = nodemailer.createTransport(smtpConfig);
        await transporter.sendMail({
            from: "pooja.wangoes@gmail.com",
            to: email,
            subject: subject,
            html: html
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};


const orderConfirm = async (email, subject) => {
    try {
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'pooja.wangoes@gmail.com',
                pass: 'tttocibpyeyseezn'
            }
        };

        var html = '<h2 style="text-align: center;">Order Confirm</h2>\
        <p style="text-align: center;">Hi '+email+',</p>\
        <p style="text-align: center;">Your Order is confirmed, your product will deliver to you soon..!!</p>\
        <h4 style="text-align: center;">Thankyou</h4>'
        var transporter = nodemailer.createTransport(smtpConfig);
        await transporter.sendMail({
            from: "pooja.wangoes@gmail.com",
            to: email,
            subject: subject,
            html: html
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = {sendEmail, sendOtp, orderConfirm};

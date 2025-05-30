const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'burglaralarmsystem9@gmail.com',
        pass: 'cqmc mqlm hnct zxlk'
    }
});


function sendEmail (user_email){
    const mailOptions = {
        from: '"BAS" <burglarAlarmsystem9@example.com>',
        to: `${user_email}`,
        subject: 'EL72 EL BET BYTSR2',
        text: 'feh 7ramy fl bet 3ndk 8albn'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error.message === "No recipients defined") {
            console.log('Warning: No recipients defined (MAIL SERVICE)');
        }
        else {
            console.log('Email sent:', info.response);
        }
    });

}



module.exports={
    sendEmail
}
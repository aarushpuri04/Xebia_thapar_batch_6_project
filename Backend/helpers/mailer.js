import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    }
});

const sendMail = async (email, subject, content) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error.message);
                return;
            }
            console.log('Verification mail sent:', info.messageId);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        console.log('Error occurred in sendMail function:', error.message);
    }
};

export default { sendMail };

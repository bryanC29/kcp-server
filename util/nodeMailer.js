import nMailer from 'nodemailer';

export const mailingService = async (user, message) => {
    const transporter = nMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_PORT != 587,
        auth: {
            user: process.env.MAIL_AUTH_USER,
            pass: process.env.MAIL_AUTH_PASSWORD
        },
    });

    try{
        const result = await transporter.sendMail({
            from: {
                name: 'Kris Computer Point',
                address: 'bryan.christy29@gmail.com',
            },
            to: user.email,
            subject: message.subject,
            text: message.text,
            html: message.html,
        });

        if(result) {
            console.log('Email sent successfully');
            console.log(result.messageId);
        } else {
            console.log('Error sending email');
        }
    }

    catch(err) {
        console.log('Error sending email:', err);
    }

}
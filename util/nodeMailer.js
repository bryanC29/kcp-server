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
                name: process.env.MAIL_FROM,
                address: process.env.MAIL_EMAIL,
            },
            to: user.email,
            subject: message.subject,
            text: message.text,
            html: message.html,
        });

        if(result) {
            return result.messageId;
        } else {
            return null;
        }
    }

    catch(err) {
        return null;
    }
}
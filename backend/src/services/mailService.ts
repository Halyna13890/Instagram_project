import nodemailer from "nodemailer";
import "dotenv/config"



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Recovery",
        html: `<p>Click the link to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>`
    });
};


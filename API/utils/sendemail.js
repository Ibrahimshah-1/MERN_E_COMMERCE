import nodemailer from "nodemailer";

 

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
    "EMAIL_PASSWORD exists:",
    !!process.env.EMAIL_PASSWORD
);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Ecommerce MERN" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        });

        console.log("Email sent:", info.messageId);

    } catch (error) {
        console.error("Email sending error:", error);
        throw error;
    }
};
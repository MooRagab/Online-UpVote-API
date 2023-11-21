import nodemailer from "nodemailer";

async function sendEmail(dest, subject, message) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      secure: true,
      auth: {
        user: process.env.SENDEREMAIL,
        pass: process.env.SENDEREMAILPASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"Ragab" <${process.env.SENDEREMAIL}>`,
      to: dest,
      subject,

      html: message,
    });
    // console.log(info);
  } catch (error) {
    // console.log("Email sent error: " + error);
  }
}

export default sendEmail;

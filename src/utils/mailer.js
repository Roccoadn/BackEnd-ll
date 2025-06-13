import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // O el proveedor que uses
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendRecoveryEmail = async (to, link) => {
  const result = await transporter.sendMail({
    from: `"CoderBackend" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <h2>Solicitaste restablecer tu contraseña</h2>
      <p>Haz clic en el siguiente enlace. Caduca en 1 hora.</p>
      <a href="${link}">${link}</a>
    `
  });

  return result;
};

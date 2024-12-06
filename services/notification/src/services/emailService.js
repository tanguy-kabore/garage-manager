const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

/**
 * Création d'un transporteur Nodemailer avec Mailtrap pour l'envoi d'emails en mode test.
 * 
 * Utilise Mailtrap comme service SMTP pour tester l'envoi d'emails sans affecter les boîtes de réception réelles.
 * Les informations de connexion sont récupérées à partir des variables d'environnement.
 * 
 * @module emailService
 */
const transporter = nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.EMAIL_TOKEN,
    testInboxId: process.env.EMAIL_TEST_INBOX,
  })
);

/**
 * Envoie un email via Mailtrap.
 * 
 * Cette fonction permet d'envoyer un email en mode sandbox, utile pour les tests sans envoyer d'emails réels.
 * 
 * @param {string} to - Adresse email du destinataire.
 * @param {string} subject - Sujet de l'email.
 * @param {string} text - Contenu textuel de l'email.
 * @param {string} [html] - Contenu HTML optionnel. Si non fourni, le contenu textuel sera utilisé.
 * 
 * @throws {Error} Si une erreur survient lors de l'envoi de l'email.
 * 
 * @example
 * sendEmail('recipient@example.com', 'Test Subject', 'Test email body')
 *   .then(() => console.log('Email sent successfully'))
 *   .catch((error) => console.error('Failed to send email:', error));
 */
async function sendEmail(to, subject, text, html = null) {
  try {
    const mailOptions = {
      from: {
        address: process.env.EMAIL_SENDER,
        name: 'Mailtrap Test',
      },
      to: [to], // Destinataires dans un tableau
      subject,
      text,
      ...(html && { html }), // Ajoute le contenu HTML si fourni
      category: 'Integration Test',
      sandbox: true, // Activer le mode sandbox
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
}

module.exports = { sendEmail };

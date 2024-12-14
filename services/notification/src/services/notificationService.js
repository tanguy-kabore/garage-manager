const axios = require('axios');
const { sendEmail } = require('@services/emailService');

/**
 * Envoie des notifications de maintenance à l'utilisateur et au mécanicien.
 * 
 * @param {Object} maintenance - Objet contenant les détails de la tâche de maintenance.
 * @param {string} event - L'événement lié à la maintenance (`created`, `completed`, ou `cancelled`).
 * 
 * @throws {Error} Si une erreur survient lors de la récupération des données ou de l'envoi des emails.
 */

async function sendMaintenanceNotification(maintenance, event) {
  console.log(`Sending ${event} notification for maintenance:`, maintenance);

  const vehicleUrl = `${process.env.VEHICLE_API_URL}/${maintenance.vehicle_id}`;
  const mechanicUrl = maintenance.mechanic_id
    ? `${process.env.USER_API_URL}/${maintenance.mechanic_id}`
    : null;

  try {
    // Récupérer les informations du véhicule
    const vehicleResponse = await axios.get(vehicleUrl);
    const vehicleData = vehicleResponse.data.vehicule;

    if (!vehicleData) {
      throw new Error('Vehicle data not found.');
    }

    const { marque, modele, annee, proprietaire_id: ownerId } = vehicleData;
    if (!ownerId) {
      console.warn('No owner found for the vehicle.');
      return;
    }

    // Récupérer les informations du propriétaire
    const ownerResponse = await axios.get(`${process.env.USER_API_URL}/${ownerId}`);
    const ownerData = ownerResponse.data.user;

    if (!ownerData) {
      throw new Error('Owner data not found.');
    }

    const ownerFullName = `${ownerData.firstName} ${ownerData.lastName}`;

    // Préparer l'email en fonction de l'événement
    let emailSubject = '';
    let emailContent = '';

    switch (event) {
      case 'created':
        emailSubject = 'Maintenance Scheduled';
        emailContent = `Hello ${ownerFullName},\n\nYour vehicle (${marque} ${modele}, ${annee}) is scheduled for maintenance from ${maintenance.start_date} to ${maintenance.end_date}. Description: ${maintenance.description}\n\nPlease ensure the vehicle is available for servicing.\n\nBest regards,\nMaintenance Team`;
        break;

      case 'completed':
        emailSubject = 'Maintenance Completed';
        emailContent = `Hello ${ownerFullName},\n\nThe maintenance task for your vehicle (${marque} ${modele}, ${annee}) has been successfully completed. The total cost of the maintenance is ${maintenance.amount} XOF.\n\nThank you for your cooperation.\n\nBest regards,\nMaintenance Team`;
        break;

      case 'cancelled':
        emailSubject = 'Maintenance Cancelled';
        emailContent = `Hello ${ownerFullName},\n\nWe regret to inform you that the scheduled maintenance for your vehicle (${marque} ${modele}, ${annee}) has been cancelled. Please contact us for further assistance.\n\nBest regards,\nMaintenance Team`;
        break;

      case 'confirmed':
        emailSubject = 'Maintenance Confirmed';
        emailContent = `Hello ${ownerFullName},\n\nWe are happy to inform you that the scheduled maintenance for your vehicle (${marque} ${modele}, ${annee}) has been confirmed. Please contact us for further assistance.\n\nBest regards,\nMaintenance Team`;
        break;

      default:
        console.warn(`Unrecognized event type: '${event}'. No notification sent.`);
        return;
    }

    // Envoyer un email au propriétaire
    await sendEmail(ownerData.email, emailSubject, emailContent);
    console.log(`Notification email sent to vehicle owner (${ownerData.email}).`);

    // Envoyer un email au mécanicien si l'événement est "confirmed"
    if (event === 'confirmed' && mechanicUrl) {
      const mechanicResponse = await axios.get(mechanicUrl);
      const mechanicData = mechanicResponse.data.user;

      if (!mechanicData) {
        throw new Error('Mechanic data not found.');
      }

      const mechanicFullName = `${mechanicData.firstName} ${mechanicData.lastName}`;
      const mechanicEmailContent = `Hello ${mechanicFullName},\n\nYou have been assigned to a maintenance task (ID: ${maintenance.id}) for the vehicle (${marque} ${modele}, ${annee}). The maintenance period is from ${maintenance.start_date} to ${maintenance.end_date}. Description: ${maintenance.description}\n\nBest regards,\nMaintenance Team`;

      await sendEmail(
        mechanicData.email,
        `Maintenance Assignment - Confirmed`,
        mechanicEmailContent
      );

      console.log(`Assignment email sent to mechanic (${mechanicData.email}).`);
    }
  } catch (error) {
    console.error('Error sending maintenance notifications:', error.message);
  }
}

module.exports = { sendMaintenanceNotification };

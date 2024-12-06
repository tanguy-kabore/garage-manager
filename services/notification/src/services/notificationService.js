const { fetchData } = require('@utils/fetchHelper');
const { sendEmail } = require('@services/emailService');

/**
 * Envoie des notifications de maintenance à l'utilisateur et au mécanicien.
 * 
 * Cette fonction récupère les informations du véhicule, du propriétaire et du mécanicien
 * associés à une tâche de maintenance. Ensuite, elle envoie des emails de notification au 
 * propriétaire du véhicule et au mécanicien, selon le type d'événement (`created`, `completed`, ou `cancelled`).
 * 
 * Si l'événement est `completed`, l'email contient également le montant de la maintenance.
 * 
 * @param {Object} maintenance - Objet contenant les détails de la tâche de maintenance. Doit inclure les champs `vehicle_id`, `mechanic_id`, `start_date`, `end_date`, `description`, et `montant` (pour l'événement `completed`).
 * @param {string} event - L'événement lié à la maintenance (`created`, `completed`, ou `cancelled`).
 * 
 * @throws {Error} Si une erreur survient lors de la récupération des données ou de l'envoi des emails.
 * 
 * @example
 * sendMaintenanceNotification({
 *   vehicle_id: '12345',
 *   mechanic_id: '67890',
 *   start_date: '2024-12-05',
 *   end_date: '2024-12-10',
 *   description: 'Engine repair',
 *   montant: 150 // uniquement pour l'événement 'completed'
 * }, 'created');
 */
async function sendMaintenanceNotification(maintenance, event) {
  console.log(`Sending ${event} notification for maintenance:`, maintenance);

  const vehicleUrl = `${process.env.VEHICLE_API_URL}/${maintenance.vehicle_id}`;
  const mechanicUrl = `${process.env.USER_API_URL}/${maintenance.mechanic_id}`;

  try {
    // Récupérer les informations du véhicule
    const vehicleData = await fetchData(vehicleUrl);
    const { marque, modele, annee, proprietaire_id: ownerId } = vehicleData.data;

    if (!ownerId) {
      console.warn('No owner found for the vehicle.');
      return;
    }

    // Récupérer les informations du propriétaire
    const ownerUrl = `${process.env.USER_API_URL}/${ownerId}`;
    const ownerData = await fetchData(ownerUrl);
    const ownerFullName = `${ownerData.firstName} ${ownerData.lastName}`;

    // Personnaliser l'email en fonction de l'événement
    let emailSubject = '';
    let emailContent = '';

    switch (event) {
      case 'created':
        emailSubject = 'Maintenance Scheduled';
        emailContent = `Hello ${ownerFullName},\n\nYour vehicle (${marque} ${modele}, ${annee}) is scheduled for maintenance from ${maintenance.start_date} to ${maintenance.end_date}. Description: ${maintenance.description}\n\nPlease ensure the vehicle is available for servicing.\n\nBest regards,\nMaintenance Team`;
        break;

      case 'completed':
        emailSubject = 'Maintenance Completed';
        emailContent = `Hello ${ownerFullName},\n\nThe maintenance task for your vehicle (${marque} ${modele}, ${annee}) has been successfully completed. The total cost of the maintenance is ${maintenance.montant} XOF.\n\nThank you for your cooperation.\n\nBest regards,\nMaintenance Team`;
        break;

      case 'cancelled':
        emailSubject = 'Maintenance Cancelled';
        emailContent = `Hello ${ownerFullName},\n\nWe regret to inform you that the scheduled maintenance for your vehicle (${marque} ${modele}, ${annee}) has been cancelled. Please contact us for further assistance.\n\nBest regards,\nMaintenance Team`;
        break;

      default:
        console.warn(`Unrecognized event type: '${event}'. No notification sent.`);
        return;
    }

    // Envoyer un email au propriétaire du véhicule
    await sendEmail(ownerData.email, emailSubject, emailContent);
    console.log(`Notification email sent to vehicle owner (${ownerData.email}).`);

    // Récupérer les informations du mécanicien
    const mechanicData = await fetchData(mechanicUrl);
    const mechanicFullName = `${mechanicData.firstName} ${mechanicData.lastName}`;

    if (event === 'created') {
      // Envoyer un email d'affectation au mécanicien pour les nouveaux événements
      await sendEmail(
        mechanicData.email,
        `Maintenance Assignment - ${event}`,
        `Hello ${mechanicFullName},\n\nYou have been assigned to a maintenance task (ID: ${maintenance.id}) for the vehicle (${marque} ${modele}, ${annee}). The maintenance period is from ${maintenance.start_date} to ${maintenance.end_date}. Description: ${maintenance.description}\n\nBest regards,\nMaintenance Team`
      );
      console.log(`Assignment email sent to mechanic (${mechanicData.email}).`);
    }
  } catch (error) {
    console.error('Error sending maintenance notifications:', error.message);
  }
}

module.exports = { sendMaintenanceNotification };

const axios = require('axios');

/**
 * Récupère des données depuis une URL via une requête HTTP GET.
 * 
 * Cette fonction utilise Axios pour envoyer une requête GET à l'URL fournie et retourne
 * les données de la réponse. En cas d'erreur lors de la récupération des données, une
 * erreur est enregistrée dans la console et l'exception est relancée.
 * 
 * @param {string} url - L'URL à partir de laquelle les données doivent être récupérées.
 * @returns {Promise<Object>} La donnée retournée par la requête HTTP, sous forme d'objet.
 * @throws {Error} Si une erreur survient lors de la requête HTTP ou du traitement de la réponse.
 * 
 * @example
 * const data = await fetchData('https://api.example.com/data');
 */
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
}

module.exports = { fetchData };

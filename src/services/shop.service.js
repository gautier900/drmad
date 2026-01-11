  import LocalSource from "@/services/localsource.service.js";

async function shopLoginFromLocalSource(data) {
  // récupération auprès de la source locale
  return LocalSource.shopLogin(data)
}
/*
async function shopLoginFromAPI(data) {
  // a écrire quand l'API est fonctionnelle
  return {}
}
 */

async function getAllVirusesFromLocalSource() {
  // récupération auprès de la source locale
  return LocalSource.getAllViruses()
}

async function getBasketFromLocalSource(data) {
  return LocalSource.getBasket(data)
}

async function updateBasketFromLocalSource(data) {
  return LocalSource.updateBasket(data)
}


/*
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/

async function shopLogin(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await shopLoginFromLocalSource(data)
  }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
  }
  return response
}


async function getAllViruses() {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getAllVirusesFromLocalSource()
  }
  // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la liste des viruses'  }
  }
  return response
}

async function getBasket(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getBasketFromLocalSource(data)
  }
  // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le basket'  }
  }
  return response
}

async function updateBasket(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await updateBasketFromLocalSource(data)
  }
  // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible d\'update le basket'  }
  }
  return response
}

async function addOrderByUserId(data) {
  let response = null;
  try {
    response = await LocalSource.addOrderByUserId(data)
  }
  catch(err) {
    response = {error: 1, status: 500, data: 'erreur réseau, impossible de créer la commande'}
  }
  return response
}

async function buyOrderById(data) {
  let response = null;
  try {
    response = await LocalSource.buyOrderById(data)
  }
  catch(err) {
    response = {error: 1, status: 500, data: 'erreur réseau, impossible de payer la commande'}
  }
  return response
}

async function getOrdersByUserId(data) {
  let response = null;
  try {
    response = await LocalSource.getOrdersByUserId(data)
  }
  catch(err) {
    response = {error: 1, status: 500, data: 'erreur réseau, impossible de récupérer les commandes'}
  }
  return response
}

async function cancelOrderById(data) {
  let response = null;
  try {
    response = await LocalSource.cancelOrderById(data)
  }
  catch(err) {
    response = {error: 1, status: 500, data: 'erreur réseau, impossible d\'annuler la commande'}
  }
  return response
}

export default {
  shopLogin,
  getAllViruses,
  getBasket,
  updateBasket,
  addOrderByUserId,
  buyOrderById,
  getOrdersByUserId,
  cancelOrderById
}
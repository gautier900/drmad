import { items, shopusers, bankaccounts, transactions } from '@/datasource/data.js'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs'

/* Les fonctions ci-dessous doivent mimer ce que renvoie l'API en fonction des requêtes possibles.

  Dans certains cas, ces fonctions vont avoir des paramètres afin de filtrer les données qui se trouvent dans data.js
  Il est fortement conseillé que ces paramètres soient les mêmes que ceux qu'il faudrait envoyer à l'API.

  IMPORTANT : toutes les requêtes à l'API DOIVENT renvoyer un objet JSON au format {error: ..., status: ..., data: ...}
  Cela implique que toutes les foncitons ci-dessous renvoient un objet selon ce format.
 */

/**
 * Si le login et le mot de passe sont fournis, que le login correspond à un utilisateur existant,
 * shopLogin() renvoie un objet contenant uniquement l'id, le nom, le login, l'email
 * et un identifiant de session sous forme d'un uuid. Sinon, un texte d'erreur est renvoyé.
 * @param data
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: {_id: string | *, name: string | *, login: string | *, email: string | *, session}}}
 */
function shopLogin(data) {
  if (!data.login || !data.password) {
    return {error: 1, status: 400, data: 'Login et mot de passe requis'}
  }

  let user = shopusers.find(e => e.login === data.login)
  if (!user) {
    return {error: 1, status: 404, data: 'Utilisateur non trouvé'}
  }

  const passwordMatches = bcrypt.compareSync(data.password, user.password)
  if (!passwordMatches) {
    return {error: 1, status: 403, data: 'Mot de passe incorrect'}
  }

  if (!user.session) {
    user.session = uuidv4()
  }

  let u = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session
  }
  return {error: 0, status: 200, data: u}
}

/**
 * getAllViruses() renvoie un tableau d'items dont le format est le même que celui stockée en source locale (donc aussi en BdD côté API)
 * @returns {{error: number, data}}
 */
function getAllViruses() {
  return {error: 0, data: items}
}

/**
 * Si un n° est fourni et qu'il correspond à un compte existant, getAccountAmount() renvoie uniquement le solde
 * du compte, sinon un texte d'erreur.
 * @param number
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: number | *}}
 */
function getAccountAmount(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
  let account = bankaccounts.find(a => a.number === number)
  if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
  return {error: 0, status: 200, data: account.amount}
}

/**
 * Si un n° est fourni et qu'il correspond à un compte existant, getAccountTransactions() renvoie uniquement le solde
 * du compte, sinon un texte d'erreur.
 * @param number
 * @returns {{error: number, status: number, data: ({_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string})[]}|{error: number, status: number, data: string}}
 */
function getAccountTransactions(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
  let account = bankaccounts.find(a => a.number === number)
  if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
  // récupérer les transaction grâce à l'_id du compte
  let trans = transactions.filter(t => t.account === account._id)
  return {error: 0, status: 200, data: trans}
}

function updateBasket(data) {
  if (!data || !data._id) return {error: 1, status: 400, data: 'identifiant requis'}
  
  let user = shopusers.find(u => u._id === data._id)
  if (!user) return {error: 1, status: 404, data: 'utilisateur non trouvé'}
  
  user.basket = data.basket || []
  
  return {error: 0, status: 200, data: JSON.parse(JSON.stringify(user.basket))}
}


function getBasket(data) {
  if (!data || !data._id) return {error: 1, status: 400, data: 'identifiant requis'}
  
  let user = shopusers.find(e => e._id == data._id)
  if (!user) return {error: 1, status: 404, data: 'utilisateur non trouvé'}
  
  if (user.basket == null) user.basket = []
  
  let basket = JSON.parse(JSON.stringify(user.basket))
  return {error: 0, status: 200, data: basket}
}


function addOrderByUserId(data) {
  let id = data.user_id
  let order = {"items": data.items}
  
  if (!id) return {error: 1, status: 400, data: 'identifiant requis'}
  
  let sum = 0
  for (let i = 0; i < order.items.length; i++) {
    let item = order.items[i]
    let promotion = 0
    let itemData = items.find(it => it._id === item.item._id || it.name === item.item.name);
    
    if (itemData && itemData.promotion) {
      for (let j = 0; j < itemData.promotion.length; j++) {
        if (itemData.promotion[j].amount === item.amount) {
          promotion = itemData.promotion[j].discount;
        }
      }
    }
    sum += (item.item.price * item.amount) * (1 - promotion/100)
  }
  
  order["date"] = new Date()
  order["total"] = sum
  order["status"] = "paiement_en_attente"
  order["uuid"] = uuidv4()

  let user = shopusers.find(u => u._id === id)
  if (!user) return {error: 1, status: 404, data: 'utilisateur non trouvé'}
  
  if (!user.orders) user.orders = []
  user.orders.push(order)
  
  return {error: 0, status: 200, data: order}
}


function buyOrderById(data) {
  const { user_id, order_id } = data;
  
  if (!user_id) return { error: 1, status: 400, data: 'Identifiant utilisateur requis' };
  
  const user = shopusers.find(u => u._id === user_id);
  if (!user) return { error: 1, status: 404, data: 'Utilisateur non trouvé' };
  
  if (!user.orders) user.orders = []
  const order = user.orders.find(o => o.uuid === order_id);
  if (!order) return { error: 1, status: 404, data: 'Commande non trouvée' };
  
  order.status = "finalisé";
  return { error: 0, status: 200, data: order };
}


function getOrdersByUserId(data) {
  let user_id = data.user_id
  if (!user_id) return {error: 1, status: 400, data: 'identifiant requis'}
  
  let user = shopusers.find(u => u._id === user_id)
  if (!user) return {error: 1, status: 404, data: 'utilisateur non trouvé'}
  
  if (!user.orders) user.orders = []
  
  return {error: 0, status: 200, data: JSON.parse(JSON.stringify(user.orders))}
}


function cancelOrderById(data) {
  let user_id = data.user_id
  let order_id = data.order_id
  
  if (!user_id) return {error: 1, status: 400, data: 'identifiant requis'}
  if (!order_id) return {error: 1, status: 400, data: 'identifiant de commande requis'}
  
  let user = shopusers.find(u => u._id === user_id)
  if (!user) return {error: 1, status: 404, data: 'utilisateur non trouvé'}
  
  if (!user.orders) user.orders = []
  let order = user.orders.find(o => o.uuid === order_id)
  if (!order) return {error: 1, status: 404, data: 'commande non trouvée'}
  
  order.status = "annulé"
  return {error: 0, status: 200, data: order}
}

export default{
  shopLogin,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
  getBasket,
  updateBasket,
  addOrderByUserId,
  buyOrderById,
  getOrdersByUserId,
  cancelOrderById
}
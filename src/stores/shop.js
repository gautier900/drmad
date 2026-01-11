import { ref } from 'vue'
import { defineStore } from 'pinia'

import ShopService from '@/services/shop.service'

export const useShopStore = defineStore('shop', () => {

  const viruses = ref([])
  const shopUser = ref(null)
  const basket = ref([])

  async function shopLogin(data) {
    console.log('login');
    let response = await ShopService.shopLogin(data)
    if (response.error === 0) {
      shopUser.value = response.data
    }
    else {
      console.log(response.data)
    }
  }

  async function getAllViruses(data) {
    console.log('récupération des viruses');
    let response = await ShopService.getAllViruses(data)
    if (response.error === 0) {
      viruses.value = response.data
    }
    else {
      console.log(response.data)
    }
  }

  async function getBasket(data) {
    console.log("Récupération du basket")
    let response = await ShopService.getBasket(data)
    if (response.error === 0) {
      basket.value = response.data
    }
    else {
      console.log(response.data)
    }
  }

  async function initBasket(){
    if (!shopUser.value || !shopUser.value._id) {
      basket.value = []
      return
    }
    
    let response = await ShopService.getBasket({_id: shopUser.value._id})

    if(response.error === 0){
      basket.value = response.data
    } else {
      console.log(response.data);
      basket.value = []
    }
  }

  async function addOrUpdateBasketItem(virusData, amount) {
    if (!shopUser.value || !shopUser.value._id) {
      return { error: 1, data: "User pas connecté" };
    }

    let currentBasket = [...basket.value];
    let virus = virusData;
    let maxAmount = virus.stock;

    if (maxAmount === 0) {
      return { error: 1, data: "Stock épuisé" };
    }
    if (amount === 0 || amount < 0) {
      return { error: 1, data: "Quantité invalide" };
    }

    let found = false;
    for (let i = 0; i < currentBasket.length; i++) {
      if (currentBasket[i].item.name === virus.name || currentBasket[i].item._id === virus._id) {
        currentBasket[i].amount += amount;
        if (currentBasket[i].amount > maxAmount) {
          currentBasket[i].amount = maxAmount;
        }
        found = true;
        break;
      }
    }

    if (!found) {
      let item = {
        "_id": virus._id,
        "name": virus.name,
        "description": virus.description,
        "price": virus.price,
        "promotion": virus.promotion,
        "object": virus.object,
      };
      currentBasket.push({ item: item, amount: amount });
    }

    let response = await ShopService.updateBasket({ _id: shopUser.value._id, basket: currentBasket });
    if (response.error === 0) {
      basket.value = response.data;
    } else {
      console.log("Error updating basket:", response.data);
    }
  }

  async function removeItemBasket(itemIndex){
    if (!shopUser.value || !shopUser.value._id) return
    
    let basketUpdate = [...basket.value]
    basketUpdate.splice(itemIndex, 1)
    
    const response = await ShopService.updateBasket({_id:shopUser.value._id, basket:basketUpdate})
    if(response.error === 0){
      basket.value = response.data
    } else {
      console.log(response.data);
    }
  }

  async function clearBasket(){
    if (!shopUser.value || !shopUser.value._id) return
    
    const response = await ShopService.updateBasket({_id:shopUser.value._id, basket:[]})
    if(response.error === 0){
      basket.value = []
    } else {
      console.log(response.data);
    }
  }
  
  async function createOrder(basketData) {
    if (!shopUser.value || !shopUser.value._id) {
      return { error: 1, data: "User pas connecté" };
    }
    
    let data = {
      user_id: shopUser.value._id,
      items: basketData || basket.value
    }
    
    let response = await ShopService.addOrderByUserId(data)
    return response
  }

  async function payOrder(orderId) {
    if (!shopUser.value || !shopUser.value._id) {
      return { error: 1, data: "User pas connecté" };
    }
    
    let data = {
      user_id: shopUser.value._id,
      order_id: orderId
    }
    
    let response = await ShopService.buyOrderById(data)
    return response
  }

  async function getOrders() {
    if (!shopUser.value || !shopUser.value._id) {
      return { error: 1, data: "User pas connecté" };
    }
    
    let data = {
      user_id: shopUser.value._id
    }
    
    let response = await ShopService.getOrdersByUserId(data)
    return response
  }

  async function cancelOrder(orderId) {
    if (!shopUser.value || !shopUser.value._id) {
      return { error: 1, data: "User pas connecté" };
    }
    
    let data = {
      user_id: shopUser.value._id,
      order_id: orderId
    }
    
    let response = await ShopService.cancelOrderById(data)
    return response
  }

  function shopLogout() {
    shopUser.value = null
    basket.value = []
  }

  return { 
    viruses, shopUser, basket,
    shopLogin, getAllViruses, getBasket, initBasket, addOrUpdateBasketItem, removeItemBasket, clearBasket,
    createOrder, payOrder, getOrders, cancelOrder, shopLogout
  }
})

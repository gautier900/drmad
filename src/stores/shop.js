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
    console.log("Initialisation du basket");
    let response = await ShopService.getBasket({_id: shopUser.value._id})

    if(response.error === 0){
      basket.value = response.data
    } else {
      console.log(response.data);
    }
  }

  async function updateBasket(itemUp, amount){
    const updateBasket = JSON.parse(JSON.stringify(user.basket))
    
    const itemId = updateBasket.findIndex(e => e.item === itemUp)
    if(itemId === -1){
      updateBasket.push({item: itemUp, amount: amount})
    } else {
      updateBasket[itemId].amount = updateBasket[itemId].amount + amount
    }

    const response = await ShopService.updateBasket({_id: shopUser.value._id, basket: updateBasket})
    if(response.error === 0){
      basket.value = response.data
    } else {
      console.log(response.data);
    }

  } 

  async function removeItemBasket(item){
    const basketUpdate = basket.value.filter(e => e.item !== item)
    const response = await ShopService.updateBasket({_id:shopUser._id, basket:basketUpdate})
    if(response.error === 0){
      basket.value = response.data
    } else {
      console.log(response.data);
    }
  }

  async function clearBasket(){
    const response = await ShopService.updateBasket({_id:shopUser._id, basket:[]})
    if(response.error === 0){
      basket.value = response.data
    } else {
      console.log(response.data);
    }
  }

  return { viruses, shopUser, basket,
     shopLogin, getAllViruses, getBasket, initBasket, updateBasket, removeItemBasket, clearBasket}
})

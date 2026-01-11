<template>
  <div>
    <h2>Panier</h2>
    
    <div v-if="formattedBasket.length === 0" class="empty-basket">
      <p>Votre panier est vide</p>
    </div>
    
    <CheckedList 
      v-else
      :data="formattedBasket" 
      :fields="['name', 'description', 'price', ['promotion', ['discount', 'amount']], 'amount']"
      :itemCheck="false"  
      :itemButton="{ text: 'Supprimer', show: true }"
      :listButton="{ text: 'Vider le panier', show: true }" 
      :itemAmount="false" 
      @item-button-clicked="supprimerItem"
      @list-button-clicked="supprimerPanier"
    />
    
    <div v-if="formattedBasket.length > 0" class="basket-actions">
      <p><strong>Total: {{ calculerTotal() }} €</strong></p>
      <button @click="acheterPanier" class="btn-buy">Acheter (créer commande)</button>
    </div>
  </div>
</template>

<script setup>
import { useShopStore } from "@/stores/shop.js";
import { useRouter } from 'vue-router';
import CheckedList from '@/components/CheckedList.vue';
import { computed, onMounted } from "vue";

const shopStore = useShopStore()
const router = useRouter()

const formattedBasket = computed(() => {
  if (!shopStore.basket || !Array.isArray(shopStore.basket)) return []
  
  return shopStore.basket.map(e => ({
    name: e.item.name,
    description: e.item.description,
    price: e.item.price,
    promotion: e.item.promotion,
    amount: e.amount
  }))
})

function supprimerItem(data) {
  shopStore.removeItemBasket(data.index || data)
}

function supprimerPanier() {
  if (confirm("Voulez-vous vraiment vider le panier ?")) {
    shopStore.clearBasket()
  }
}

async function acheterPanier() {
  if (shopStore.basket.length === 0) {
    alert("Le panier est vide !")
    return
  }
  
  const response = await shopStore.createOrder()
  
  if (response.error === 0 && response.data.uuid) {
    const uuid = response.data.uuid
    

    await shopStore.clearBasket()
    router.push({ name: 'ShopPay', params: { orderId: uuid } })
  
  } else {
    alert(`Erreur lors de la création de la commande: ${response.data}`)
  }
}

function calculerTotal() {
  if (!shopStore.basket || !Array.isArray(shopStore.basket)) return 0
  
  let total = 0
  for (let e of shopStore.basket) {
    let itemPrice = e.item.price * e.amount
    
    if (e.item.promotion && Array.isArray(e.item.promotion)) {
      for (let promo of e.item.promotion) {
        if (promo.amount === e.amount) {
          itemPrice = itemPrice * (1 - promo.discount / 100)
          break
        }
      }
    }
    total += itemPrice
  }
  return total.toFixed(2)
}

onMounted(() => {
  shopStore.initBasket()
})
</script>

<style scoped>
.empty-basket {
  padding: 20px;
  text-align: center;
  color: #666;
}

.basket-actions {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.btn-buy {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.btn-buy:hover {
  background: #45a049;
}
</style>

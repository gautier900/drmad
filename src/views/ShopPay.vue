<template>
  <div class="shop-pay">
    <h2>Payer une commande</h2>
    
    <div class="pay-form">
      <div class="form-group">
        <label for="order-id">UUID de la commande :</label>
        <input 
          type="text" 
          id="order-id" 
          v-model="currentOrderId"
          :placeholder="orderId || 'Entrez l\'UUID de la commande'"
        />
      </div>
      
      <button @click="payOrder" class="btn-pay">Payer</button>
      
      <p v-if="message" :class="messageClass">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '@/stores/shop';

const props = defineProps({
  orderId: String
})

const router = useRouter()
const shopStore = useShopStore()

const currentOrderId = ref(props.orderId || '')
const message = ref('')
const messageClass = ref('')

async function payOrder() {
  message.value = ''
  
  if (!shopStore.shopUser || !shopStore.shopUser._id) {
    message.value = "Vous devez être connecté pour payer une commande"
    messageClass.value = 'error'
    return
  }
  
  if (!currentOrderId.value) {
    message.value = "Veuillez saisir l'UUID de la commande"
    messageClass.value = 'error'
    return
  }
  
  try {
    const response = await shopStore.payOrder(currentOrderId.value)
    
    if (response.error === 0) {
      message.value = 'Paiement effectué avec succès !'
      messageClass.value = 'success'
      
      setTimeout(() => {
        router.push('/shop/orders')
      }, 1500)
    } else {
      message.value = response.data || 'Erreur lors du paiement'
      messageClass.value = 'error'
    }
  } catch (err) {
    console.error('Erreur dans payOrder:', err)
    message.value = 'Erreur lors du paiement. Veuillez réessayer.'
    messageClass.value = 'error'
  }
}

onMounted(() => {
  if (props.orderId) {
    currentOrderId.value = props.orderId
  }
})
</script>

<style scoped>
.shop-pay {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.pay-form {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-pay {
  background: #4CAF50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.btn-pay:hover {
  background: #45a049;
}

.error {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 15px;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
}

.success {
  color: #388e3c;
  font-size: 14px;
  margin-top: 15px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
}
</style>

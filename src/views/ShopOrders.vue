<template>
  <div class="shop-orders">
    <h2>Mes commandes</h2>
    
    <div v-if="loading" class="loading">
x    </div>
    
    <div v-else-if="orders.length === 0" class="no-orders">
      <p>Vous n'avez pas encore de commandes.</p>
    </div>
    
    <div v-else class="orders-list">
      <div 
        v-for="(order, index) in orders" 
        :key="order.uuid" 
        class="order-card"
        :class="'status-' + order.status"
      >
        <div class="order-header">
          <h3>Commande #{{ index + 1 }}</h3>
          <span class="order-status">{{ getStatusLabel(order.status) }}</span>
        </div>
        
        <div class="order-details">
          <p><strong>UUID:</strong> {{ order.uuid }}</p>
          <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
          <p><strong>Total:</strong> {{ order.total }} €</p>
          
          <details class="order-items">
            <summary>Articles ({{ order.items.length }})</summary>
            <ul>
              <li v-for="(item, idx) in order.items" :key="idx">
                {{ item.item.name }} x{{ item.amount }} - {{ item.item.price }}€
              </li>
            </ul>
          </details>
        </div>
        
        <div v-if="order.status === 'paiement_en_attente'" class="order-actions">
          <button @click="goToPay(order.uuid)" class="btn-pay">Payer</button>
          <button @click="cancelOrder(order.uuid)" class="btn-cancel">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '@/stores/shop';

const router = useRouter()
const shopStore = useShopStore()

const orders = ref([])
const loading = ref(true)

async function loadOrders() {
  loading.value = true
  
  if (!shopStore.shopUser || !shopStore.shopUser._id) {
    alert("Vous devez être connecté pour voir vos commandes")
    router.push('/shop/login')
    return
  }
  
  try {
    const response = await shopStore.getOrders()
    
    if (response.error === 0) {
      orders.value = response.data || []
    } else {
      console.error("Erreur lors du chargement des commandes:", response.data)
      orders.value = []
    }
  } catch (err) {
    console.error("Erreur:", err)
    orders.value = []
  } finally {
    loading.value = false
  }
}

function goToPay(uuid) {
  router.push({ name: 'ShopPay', params: { orderId: uuid } })
}

async function cancelOrder(uuid) {
  if (!confirm("Voulez-vous vraiment annuler cette commande ?")) {
    return
  }
  
  try {
    const response = await shopStore.cancelOrder(uuid)
    
    if (response.error === 0) {
      alert("Commande annulée avec succès")
      await loadOrders() 
    } else {
      alert(`Erreur lors de l'annulation: ${response.data}`)
    }
  } catch (err) {
    console.error("Erreur:", err)
    alert("Erreur lors de l'annulation de la commande")
  }
}

function getStatusLabel(status) {
  const labels = {
    'paiement_en_attente': 'En attente de paiement',
    'finalisé': 'Finalisée',
    'annulé': 'Annulée'
  }
  return labels[status] || status
}

function formatDate(date) {
  if (!date) return 'Date inconnue'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.shop-orders {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}

 .no-orders {
  text-align: center;
  padding: 40px;
  color: #666;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-card.status-waiting_payment {
  border-color: #ff9800;
}

.order-card.status-finalized {
  border-color: #4CAF50;
}

.order-card.status-cancelled {
  border-color: #9e9e9e;
  opacity: 0.7;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-header h3 {
  margin: 0;
  color: #333;
}

.order-status {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.status-waiting_payment .order-status {
  background: #fff3e0;
  color: #ff9800;
}

.status-finalized .order-status {
  background: #e8f5e9;
  color: #4CAF50;
}

.status-cancelled .order-status {
  background: #f5f5f5;
  color: #9e9e9e;
}

.order-details p {
  margin: 8px 0;
  color: #555;
}

.order-items {
  margin-top: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.order-items summary {
  cursor: pointer;
  font-weight: bold;
  color: #333;
}

.order-items ul {
  margin-top: 10px;
  padding-left: 20px;
}

.order-items li {
  margin: 5px 0;
  color: #666;
}

.order-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.btn-pay {
  flex: 1;
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-pay:hover {
  background: #45a049;
}

.btn-cancel {
  flex: 1;
  background: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel:hover {
  background: #da190b;
}
</style>

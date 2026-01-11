<template>
  <Navbar :titles="menuTitles" @menu-clicked="goTo"/>  
    <h1>Welcome to DrMad app</h1>

    <router-view>      
    </router-view>
</template>

<script setup>
import {onMounted, computed} from "vue";
import {useShopStore} from "@/stores/shop.js";
import {useRouter} from "vue-router"
import Navbar from "@/components/Navbar.vue";

const shopStore = useShopStore()
const routes = useRouter()

const menuTitles = computed(() => {
  const isLoggedIn = shopStore.shopUser !== null
  
  if (!isLoggedIn) {
    return [
      { text: 'Login', color: 'blue' }
    ]
  } else {
    return [
      { text: 'Logout', color: 'red' },
      { text: 'Acheter', color: 'green' },
      { text: 'Payer', color: 'orange' },
      { text: 'Mes commandes', color: 'purple' }
    ]
  }
})

const goTo = ((linkIndex) =>{
  const isLoggedIn = shopStore.shopUser !== null
  
  if (!isLoggedIn) {
    if (linkIndex === 0) routes.push('/shop/login')
  } else {
    if (linkIndex === 0) {
      shopStore.shopLogout()
      routes.push('/shop')
    }
    else if (linkIndex === 1) routes.push('/shop/buy')
    else if (linkIndex === 2) routes.push('/shop/pay')
    else if (linkIndex === 3) routes.push('/shop/orders')
  }
})

onMounted(() => {
  shopStore.getAllViruses()
})
</script>

<style scoped></style>

<template>
  <Navbar :titles="menuTitles" @menu-clicked="goTo"/>  
    <h1>Welcome to DrMad app</h1>

    <router-view>      
    </router-view>
</template>

<script setup>
import {onMounted} from "vue";
import {useShopStore} from "@/stores/shop.js";
import {useRouter} from "vue-router"
import Navbar from "@/components/Navbar.vue";

const shopStore = useShopStore()
const routes = useRouter()

const menuTitles = [
        { text: 'Shop Login ', color: 'blue' },
        { text: 'Viruses', color: 'green' },
        { text: 'Compte Bancaire', color: 'orange' }
      ]

const goTo = ((linkIndex) =>{
  if(linkIndex === 0){routes.push('/shop/login')}
  else if(linkIndex == 1){routes.push('/shop/items')}
  else if(linkIndex === 2){routes.push('/bank/account')}
})

// Dès que l'appli est lancée, on va chercher la liste des virus pour la stocker dans le store
onMounted(() => {
  shopStore.getAllViruses()
})
</script>

<style scoped></style>

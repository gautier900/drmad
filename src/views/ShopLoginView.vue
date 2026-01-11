<template>
  <div>
    <h1>Login</h1>

    <span>login</span><input v-model="login">
    <span>password</span><input type="password" v-model="password">
    <button @click="connexion">Login</button>
    
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    
    <p v-if="shopStore.shopUser">Connecté : {{shopStore.shopUser.name}}</p>
  </div>
  <br>
  <hr />
  

</template>

<script setup>
import {ref} from "vue";
import {useShopStore} from "@/stores/shop.js";
import {useRouter} from "vue-router";

const login = ref('')
const password = ref('')
const errorMessage = ref('')
const shopStore = useShopStore()
const router = useRouter()

async function connexion() {
  errorMessage.value = ''
  
  const response = await shopStore.shopLogin({login: login.value, password: password.value})
  
  if (shopStore.shopUser) {
    router.push('/shop/buy')
  } else {
    errorMessage.value = 'Login ou mot de passe incorrect'
  }
}


</script>
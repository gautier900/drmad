<template>
  <div>
    <h1>Panier</h1>
    <CheckedList :data="filterViruses" :itemCheck="false"  :itemButton="{ text: 'Supprimer', show: true }"
      :listButton="{ text: 'Vider le panier', show: true }" :itemAmount="true" @item-button-clicked="supprimerItem"
       @list-button-clicked="supprimerPanier"></CheckedList>
  
  </div>
</template>

<script setup>
import { useShopStore } from "@/stores/shop.js";
import CheckedList from '@/components/CheckedList.vue';
import { computed, ref } from "vue";

const shopStore = useShopStore()


const supprimerItem = (LinkIndex) => {
  shopStore.removeItemBasket(LinkIndex)
}

const supprimerPanier = (LinkIdex) => {
  shopStore.clearBasket()
}

</script>

<template>
  <div>
    <ul>
      <li v-for="(item, index) in data" :key="item._id">
        <input v-if="itemCheck == true" type="checkbox"  @click="$emit('checked-changed',index)">
        {{ item.name }}, {{ item.price }}, {{ item.promotion }}
        <input v-if="itemAmount" type="number" name="itemAmount" id="itemAmount">
        <button v-if="itemButton.show == true" @click="$emit('item-button-clicked', index)">{{ itemButton.text }}</button>
      </li>
      <button v-if="listButton.show == true" @click="$emit('list-button-clicked')">{{ listButton.text }}</button>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  data: Array, // les données sources
  fields: Array, // le tableau contenant le nom des champs
  itemCheck: Boolean, // s'il y a des case à cocher
  checked: Array, // le tableau des cases cochées
  itemButton: Object, // l'objet pour les boutons d'items
  listButton: Object, // l'objet pour le bouton de liste
  itemAmount: Boolean 
})
</script>

<style scoped>
</style>
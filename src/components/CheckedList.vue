<template>
  <div>
    <ul>
      <li v-for="(item, index) in data" :key="index">
        <input 
          v-if="itemCheck == true" 
          type="checkbox" 
          :checked="checked && checked[index]"
          @change="$emit('checked-changed', index)"
        >
        
        <span v-for="(field, fieldIndex) in fields" :key="fieldIndex">
          {{ getFieldValue(item, field) }}
        </span>
        
        <input 
          v-if="itemAmount" 
          type="number" 
          :value="amounts[index] || 1" 
          min="1"
          step="1"
          @input="updateAmount(index, $event.target.value)"
        >

        <button
          v-if="itemButton && itemButton.show == true"
          @click="$emit('item-button-clicked', { index, amount: amounts[index] || 1 })"
        >
          {{ itemButton.text }}
        </button>
      </li>
    </ul>
    <button
      v-if="listButton && listButton.show == true"
      @click="$emit('list-button-clicked', data.map((item, index) => checked && checked[index] ? { index, amount: amounts[index] || 1 } : null).filter(item => item !== null))"
    >
      {{ listButton.text }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    data: Array, // les données sources
    fields: Array, // le tableau contenant le nom des champs à afficher
    itemCheck: Boolean, // s'il y a des case à cocher
    checked: Array, // le tableau des cases cochées
    itemButton: Object, // l'objet pour les boutons d'items
    listButton: Object, // l'objet pour le bouton de liste
    itemAmount: Boolean, // Affiche le champ de saisie numérique si true
})

const amounts = ref({})

function updateAmount(index, value) {
  const amount = parseInt(value, 10) || 1
  amounts.value = { ...amounts.value, [index]: amount }
}

function getFieldValue(item, field) {
  if (Array.isArray(field)) {
    let value = item[field[0]]
    if (Array.isArray(value) && value.length > 0) {
      return value.map(v => {
        return field[1].map(e => v[e]).join('/')
      }).join(', ')
    }
    return ''
  }
  return item[field] !== undefined ? item[field] : ''
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 8px 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
span {
  margin-right: 10px;
}
input[type="number"] {
  width: 60px;
  margin: 0 10px;
}
button {
  margin-left: 10px;
  padding: 4px 12px;
  cursor: pointer;
}
</style>
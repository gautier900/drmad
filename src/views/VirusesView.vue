<template>
  <div>
    <h1>Les virus</h1>
    <p>Le tableau dans le store : {{ shopStore.viruses }}</p>
    <p>sous forme de liste avec certains champs</p>
    <ul>
      <li v-for="(virus, index) in shopStore.viruses" :key="index">{{ virus.name }} : {{ virus.price }}</li>
    </ul>

    <span>Filtres :</span>
    <br>
    <label for="filterpriceactive">par prix</label>
    <input type="checkbox" v-model="filterPriceActive" id="filterpriceactive">
    <br>
    <label for="filternamepriceactive">par nom</label>
    <input type="checkbox" v-model="filterNameActive" id="filternameactive">
    <br>
    <label for="filterstockpriceactive">par stock</label>
    <input type="checkbox" v-model="filterStockActive" id="filterstockactive">

    <div v-if="filterPriceActive">
      <label for="filterprice">prix inférieur à : </label>
      <input v-model="priceFilter" id="filterprice">
      <ul>
        <li v-if="(!isNaN(priceFilter)) && priceFilter != 0" v-for="(virus, index) in filterVirusesByPrice"
          :key="index">
          {{ virus.name }} : {{ virus.price }}
        </li>
      </ul>
    </div>
    <br>
    <div v-if="filterNameActive">
      <label for="filtername">Nom : </label>
      <input v-model="nameFilter" id="filtername" type="text">
      <ul>
        <li v-if="nameFilter != ''" v-for="(virus, index) in filterVirusesByName" :key=index>
          Nom : {{ virus.name }}
        </li>
      </ul>
    </div>
    <br>
    <div v-if="(filterStockActive)">
      <label for="filterstock">Filtrer par stock disponible : </label>
      <input v-model="stockFilter" type="checkbox" id="filterstock">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(virus, index) in filterVirusesByStock" :key="index">
            <td>{{ virus.name }}</td>
            <td>{{ virus.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr>
    <label for="filterViruses">Filre sur le prix, le nom et le stock</label>
    <br>
    <br>
    <label for="price">Prix inférieur à : </label>
    <input type="text" v-model="filterPricePart">
    <br>
    <label for="name">Nom : </label>
    <input type="text" v-model="filterNamePart">
    <br>
    <label for="stock">Stock : </label>
    <input type="checkbox" v-model="filterStockPart">

    <ul>
      <li v-for="(virus, index) in filterViruses" :key="index">
        {{ virus.name }}
      </li>
    </ul>







    <h2>Affichage via component/CheckedList : </h2>
    <CheckedList :data="filterViruses" :itemCheck="true" :checked="checked" :itemButton="{ text: 'Info', show: true }"
      :listButton="{ text: 'Voir virus cochés', show: true }" @item-button-clicked="infoLigne"
      @checked-changed="changeSelection" @list-button-clicked="afficheVirus"></CheckedList>
  </div>
</template>

<script setup>
import { useShopStore } from "@/stores/shop.js";
import CheckedList from '@/components/CheckedList.vue';
import { computed, ref } from "vue";


const shopStore = useShopStore()

const selected = ref([])

const checked = computed(() => {
  const filterId = filterViruses.value.map(v => v._id)
  const selectedFilter = selected.value.filter(id  => filterId.includes(id))
  return filterViruses.value.map(virus => selectedFilter.includes(virus._id))
})


const changeSelection = (idx) => {
  const virusFiltre = filterViruses.value[idx]
  const virusId = virusFiltre._id

  if (!selected.value.includes(virusId)) {
    selected.value.push(virusId)
  } else {
    selected.value = selected.value.filter(id => id !== virusId)
  }

}

const infoLigne = ((LinkIndex) => {
  let enVente = '';
  if (filterViruses.value[LinkIndex].stock !== 0) enVente = 'en vente'
  else enVente = 'épuisé'
  let contenu = `${filterViruses.value[LinkIndex].name}, stock : ${filterViruses.value[LinkIndex].stock}, ${enVente}`
  alert(contenu)
});

const etatCaC = ((LinkIndex) => {
  const virus = shopStore.viruses[LinkIndex]
  if (virus.checked == true) {
    virus.checked = false;
  }
  else {
    virus.checked = true;
  }
})

const afficheVirus = (() => {
  const selectedFilter = selected.value.filter(id => filterViruses.value.map(v => v._id).includes(id))
  const virusCoches = shopStore.viruses.filter(virus => selectedFilter.includes(virus._id))
  let message = 'Virus coché : '
  for (let i = 0; i < virusCoches.length; i++) {
    message += virusCoches[i].name
    if (virusCoches.length - 1 !== i) {
      message += ', '
    }
  }
  alert(message)
})

const filterPriceActive = ref(false)
const filterNameActive = ref(false)
const filterStockActive = ref(false)

const priceFilter = ref(0)
const nameFilter = ref('')
const stockFilter = ref(false)


const filterPricePart = ref(0)
const filterNamePart = ref('')
const filterStockPart = ref(false)


const filterVirusesByPrice = computed(() => {
  if (priceFilter.value > 0) return shopStore.viruses.filter(v => v.price < priceFilter.value)
  return shopStore.viruses
})

const filterVirusesByName = computed(() => {
  if (nameFilter.value != null) return shopStore.viruses.filter(v => v.name.includes(nameFilter.value.toLocaleLowerCase()))
  return shopStore.viruses
})

const filterVirusesByStock = computed(() => {
  if (stockFilter.value == true) return shopStore.viruses.filter(v => v.stock > 0)
  return shopStore.viruses
})

const filterViruses = computed(() => {
  let virus = shopStore.viruses

  if (filterPricePart.value > 0)
    virus = virus.filter(v => v.price < filterPricePart.value)

  if (filterNamePart.value)
    virus = virus.filter(v => v.name.toLowerCase().includes(filterNamePart.value.toLowerCase()))

  if (filterStockPart.value)
    virus = virus.filter(v => v.stock > 0)

  return virus
})



</script>

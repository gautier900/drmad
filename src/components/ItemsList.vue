<template>
  <div>
    <h2>Les virus disponibles</h2>
    
    <div class="filters">
      <label>
        <input type="checkbox" v-model="filterPriceActive"> par prix
      </label>
      <label>
        <input type="checkbox" v-model="filterNameActive"> par nom
      </label>
      <label>
        <input type="checkbox" v-model="filterStockActive"> par stock
      </label>
    </div>
    
    <div class="filter-inputs" v-if="filterPriceActive || filterNameActive || filterStockActive">
      <div v-if="filterPriceActive">
        <label for="filterprice">Prix inférieur à : </label>
        <input v-model.number="priceFilter" id="filterprice" type="number">
      </div>
      <div v-if="filterNameActive">
        <label for="filtername">Nom contient : </label>
        <input v-model="nameFilter" id="filtername" type="text">
      </div>
      <div v-if="filterStockActive">
        <label>
          <input type="checkbox" v-model="stockFilter"> En stock uniquement
        </label>
      </div>
    </div>
    
    <hr>
    
    <CheckedList
      :data="filterViruses"
      :fields="['name', 'price', ['promotion', ['discount', 'amount']], 'stock']"
      :itemCheck="true"
      :item-button="{show: true, text: 'Ajouter au panier'}"
      :list-button="{show: true, text: 'Info sélectionnés'}"
      :checked="checked"
      :itemAmount="true"
      @checked-changed="changeSelection"
      @item-button-clicked="ajouterPanier"
      @list-button-clicked="selectionne"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useShopStore } from "@/stores/shop";
import CheckedList from "@/components/CheckedList.vue";

const shopStore = useShopStore()

const priceFilter = ref(0)
const nameFilter = ref("")
const stockFilter = ref(true)
const filterPriceActive = ref(false)
const filterNameActive = ref(false)
const filterStockActive = ref(false)
const selected = ref([])

const checked = computed(() => {
  return filterViruses.value.map(v =>
    selected.value.includes(shopStore.viruses.indexOf(v))
  );
})

const filterViruses = computed(() => {
  return shopStore.viruses
    .filter(v => (filterPriceActive.value ? v.price < priceFilter.value : true))
    .filter(v => (filterNameActive.value ? v.name.toLowerCase().includes(nameFilter.value.toLowerCase()) : true))
    .filter(v => (filterStockActive.value ? v.stock > 0 : true));
})

function changeSelection(idx) {
  let virusIndex = shopStore.viruses.indexOf(filterViruses.value[idx]);
  let selectedIndex = selected.value.indexOf(virusIndex);

  if (selectedIndex !== -1) {
    selected.value.splice(selectedIndex, 1);
  } else {
    selected.value.push(virusIndex);
  }
}

function ajouterPanier(data) {
  let virus = filterViruses.value[data.index];
  shopStore.addOrUpdateBasketItem(virus, data.amount);
}

function selectionne() {
  let s = filterViruses.value
    .filter((v, i) => checked.value[i])
    .map(v => `${v.name}: ${v.stock} en stock`)
    .join("\n");
  alert(s || "Aucun virus sélectionné");
}

onMounted(() => {
  shopStore.getAllViruses();
})
</script>

<style scoped>
.filters {
  margin: 10px 0;
}
.filters label {
  margin-right: 15px;
}
.filter-inputs {
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}
.filter-inputs > div {
  margin: 5px 0;
}
</style>

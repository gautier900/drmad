<template>
    <div class="grid">
        <div class="row">
            <ItemsList />
        </div>
        <div class="row">
            <BasketList />
        </div>
    </div>
</template>

<script setup>
import ItemsList from '@/components/ItemsList.vue';
import BasketList from '@/components/BasketList.vue';
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

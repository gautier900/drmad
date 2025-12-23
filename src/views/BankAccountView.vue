<template>
  <div>
    <h1>Account amount</h1>

    <span>account number</span><input v-model="number">
    <button :disabled="number=='' || !verifNumber"    @click="bankStore.getAccountAmount(number)">Get amount</button>
    <button :disabled="number=='' || !verifNumber" @click="bankStore.getAccountTransactions(number)">Get transactions</button>
    <br>
    <button @click="reset">Reset</button>
    <p v-if="bankStore.accountNumberState==1 && bankStore.accountNumberState !== 0" >available amount: {{bankStore.accountAmount}}</p>
    <p v-if="bankStore.accountNumberState == -1">Numéro de compte erroné</p>
    <hr />
    <!-- <p>passed transactions: {{ bankStore.accountTransactions }}</p> -->
    <ul>
      <li v-if="bankStore.accountNumberState == 1 && bankStore.accountNumberState !== 0" v-for="transaction in bankStore.accountTransactions"
      :key="transaction.date.$date"
      >
        Transaction date : {{ transformeDate(transaction) }}
        <br>
        Montant : {{ transaction.amount }}
        
      </li>
    </ul>
  </div>

</template>

<script setup>
import {computed, ref} from "vue";
import {useBankStore} from "@/stores/bank.js";
import { transactions } from "@/datasource/data";

const number = ref('')
const bankStore = useBankStore()
const dateTrans = ref('')
const date = ref('')

const transformeDate = (transaction) => {
  dateTrans.value = transaction.date.$date
  const jour = dateTrans.value[8] + dateTrans.value[9]
  const mois = dateTrans.value[5] + dateTrans.value[6]
  const annee = dateTrans.value[0] + dateTrans.value[1] + dateTrans.value[2] + dateTrans.value[3]
  const heure = dateTrans.value[11] + dateTrans.value[12]
  const minute = dateTrans.value[14] + dateTrans.value[15]
  const seconde = dateTrans.value[17] + dateTrans.value[17]
  return jour+'/'+mois+'/'+annee+' at '+heure+':'+minute+':'+seconde
}

const verifNumber = computed(() =>  {
  if(number.value.length !== 30) return false;

  for(let i=0; i<22;i++){
    if(!/^\p{L}$/u.test(number.value[i]) && isNaN(number.value[i])) return false;
  }
  if(number.value[22]!=='-') return false;
  for(let i=23; i<30;i++){
    if(isNaN(number.value[i])) return false;
  }
  return true
})

const reset = () => {
  number.value = ''
  bankStore.accountNumberState = 0
}


</script>

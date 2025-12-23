import { ref} from 'vue'
import { defineStore } from 'pinia'

import BankAccountService from '@/services/bankaccount.service'

export const useBankStore = defineStore('bank', () => {

  const accountAmount = ref(0)
  const accountTransactions = ref([])
  const accountNumberState = ref(0)

    async function getAccountAmount( number) {
    console.log('get account amount');
    let response = await BankAccountService.getAccountAmount(number)
    if (response.error === 0) {
      accountAmount.value = response.data
      accountNumberState.value = 1
    }
    else {
      console.log(response.data)
      accountNumberState.value = -1
    }
  }

  async function getAccountTransactions( number) {
    console.log('get account transactions');
    let response = await BankAccountService.getAccountTransactions(number)
    if (response.error === 0) {
      accountTransactions.value = response.data
      accountNumberState.value = 1
    }
    else {
      console.log(response.data)
      accountNumberState.value = -1
    }
  }

  return { accountNumberState, accountAmount, accountTransactions, getAccountAmount, getAccountTransactions }
})

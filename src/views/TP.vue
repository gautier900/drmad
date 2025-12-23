<template>

    <form action="" @submit.prevent="addTask">
        <fieldset role="group">
            <input 
            v-model="newTodo"
            type="text" 
            placeholder="Le nom de la tâche">
            <button :disable="newTodo.length ==0">Ajouter</button>
        </fieldset>
    </form>
    <div v-if='todos.length === 0'>
        Il n'y a pas de tâche à faire
    </div>
    <div v-else>
        <ul>
            <li v-for="todo in sortedTask()"
            :key="todo.date"
            :class="{completed: todo.completed}">
                <label>
                    <input type="checkbox" v-model="todo.completed">
                    {{ todo.title }}
                </label>
                
            </li>
        </ul>
        <label>
            <input type="checkbox" v-model="hideCompleted">
            Masquer les tâches complétées
        </label>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const newTodo = ref('')
const hideCompleted = ref(false)

const todos = ref([])


const addTask = () =>{
    todos.value.push({
        title:newTodo.value,
        completed: false,
        date: Date.now()
    })
    newTodo.value= ''
}

const sortedTask = () => {
    const sorted =  todos.value.toSorted((a, b) => a.completed > b.completed ? 1 : -1)
    if(hideCompleted.value === true){
        return sorted.filter(t => t.completed == false)
    }
    return sorted
}

</script>


<style>
.completed {
    opacity: 0.5;
    text-decoration: line-through;
}
</style>
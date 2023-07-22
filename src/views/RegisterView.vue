<script>
export default {
    data() {
        return {
            firsname: '',
            lastname: '',
            email: ''
        }
    },
    methods: {
        submit() {
            //todo: post
            alert("Hello" + this.email)
        }
    }
}
</script>
<template>
    <div class="container">
        <div>
            Regisztracio
        </div>
        <form @submit.prevent="submit">
            <div>
                <input type="name" placeholder="Vezetéknév" v-model="firstname" />
            </div>
            <div>
                <input type="name" placeholder="Keresztnév" v-model="lastname" />
             </div>
            <div>
                <input type="email" placeholder="Email" v-model="email" />
            </div>
            <button type="submit">
                Kezdjünk bele!
            </button>
        </form>

    </div>
</template>

<style>
.container {
    text-align: center;
}
</style>

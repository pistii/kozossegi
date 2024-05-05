<template>
    <v-card-text class="ma-6 mx-auto w-50">
        <v-text-field 
        ref="email" 
        v-model="email" 
        :rules="[() => !!email || 'This field is required', //Email validation
        () => !email || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'E-mail must be valid']"
        label="Email address" placeholder="example123@email.com" required />

        <v-text-field ref="password" v-model="password" 
        :rules="[() => !!password || 'This field is required', //Password validation
        () => password.length > 5 || 'Minimum 6 character required'
        ]" label="Password" 
        :type="showPw ? 'text' : 'password'" 
        required 
        :append-inner-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPw = !showPw"
        />
    </v-card-text>
    <v-card class="text-center mx-16 bg-blue-lighten-2" v-if="notFound">
    <v-icon class="bg-red" style="border-radius: 50%;">mdi-exclamation</v-icon>
        <div>
            Hibás email vagy jelszó.
        </div>
    </v-card>
    <v-divider class="mt-12"></v-divider>
    <v-card-actions class="justify-space-between">
        <v-btn class="px-6" variant="text" @click="forgotPwBtn()">
            Elfelejtettem a jelszavam!
        </v-btn>
            <v-btn color="green" variant="elevated" @click="login()">
            Login
        </v-btn>
    </v-card-actions>
</template>

<script>

export default {
    emits: ['forgotPw'],
    
    data: () => ({
        email: 'firstTest@gmail.com',
        password: '',
        showPw: false,
        notFound: false,
    }),
    methods: {
        async login() {
            this.notFound = false;
            console.log("trying to login..." + this.email, this.password);
            await loginUser(this.email, this.password)
                .then(resp => this.throwConnectionResult(resp))
                .catch(error => error === "Not Found" ? this.notFound = true : this.notFound = false)
        },
        forgotPwBtn() {
            this.$emit('forgotPw', this.email);
        },
        throwConnectionResult(response, status) {
            console.log(response);
            if (response) {
                loginSetup();
            }
            else {
                console.log("Not found")
            }
        },
    }
}
</script>
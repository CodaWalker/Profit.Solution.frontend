<template>
<div class="container pt-4">
    <b-card bg-variant="dark" text-variant="white">
        <h3>Добро пожаловать {{currentUser.username}}</h3>


        <b-card-text v-if="currentUser.typeUser === 'client'">
            <h5>Ваша учетная запись клиент</h5>
            <b-button href="/tickets/-1" variant="primary">Перейти к созданию заявки</b-button>
        </b-card-text>
        <b-card-text v-if="currentUser.typeUser === 'operator'">
            <h5>Ваша учетная запись оператор</h5>
            <b-button href="/tickets" variant="primary">Перейти к просмору всех заявок</b-button>
        </b-card-text>
        <b-card-text v-if="currentUser.typeUser === 'specialist'">
            <h5>Ваша учетная запись специалист</h5>
            <b-button href="/tickets" variant="primary">Перейти к просмотру заявок</b-button>
        </b-card-text>
        <b-card-text v-if="currentUser.typeUser === null">
            <h5>Ваша учетная запись не установлена, обратитесь к администратору</h5>
        </b-card-text>
    </b-card>
</div>
</template>
<script>
import UserService from '../services/user.service';
// import CourseService from '../services/course.service';

export default {
    name: 'profile',
    data() {
        return {
            currentUser: null,
            transactions: [],
            users: [],
            fullDataUser: false
        };
    },
    created() {
        // eslint-disable-next-line no-console
        this.currentUser = UserService.currentUserValue;
        if(!this.currentUser){
            this.$router.push('/login');
        }

        // CourseService.filterTransactions(this.currentUser.id).then(trans => {
        //     this.transactions = trans.data;
        // });
    },
    methods: {
        logOut() {
            UserService.logOut().then(() => {
                this.$router.push('/login');
            });
        }
    }
}
</script>
<style scoped>

</style>


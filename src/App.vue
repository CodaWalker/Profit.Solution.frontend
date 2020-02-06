<template>
    <div id="app">
        <nav class="navbar navbar-expand navbar-dark bg-dark">
            <a href="https://vuejs.org/" class="navbar-brand">
                <img src="./assets/logo.png" width="30" height="30" class="d-inline-block align-top"/>
                Vue.js
            </a>
            <div class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a href="/home" class="nav-link" v-if="currentUser">
                        <font-awesome-icon icon="home"/>
                        Домашняя
                    </a>
                </li>
                <li class="nav-item" v-if="currentUser !== null && user.typeUser === 'operator'">
                    <a href="/users" class="nav-link">
                        <font-awesome-icon icon="user"/>
                        Список пользователей(О)
                    </a>
                </li>
                <li class="nav-item" v-if="currentUser !== null && user.typeUser === 'operator'">
                    <a href="/tickets" class="nav-link">
                        <font-awesome-icon icon="user"/>
                        <div>Список заявок (О)</div>
                    </a>
                </li>
                <li class="nav-item" v-if="currentUser !== null">
                    <a href="/my-tickets" class="nav-link">
                        <font-awesome-icon icon="user"/>
                        <div>Мои заявки (O,С,K)</div>
                    </a>
                </li>
                <li class="nav-item" v-if="currentUser !== null && user.typeUser === 'client'">
                    <a @click="addTicketPage()" href="" class="nav-link">
                        <font-awesome-icon icon="user"/>
                        Создать заявку(К)
                    </a>
                </li>
                <li class="nav-item" v-if="currentUser !== null && user.typeUser === 'operator'">
                    <a @click="addTicketPage()" href="" class="nav-link">
                        <font-awesome-icon icon="user"/>
                        Создать заявку(О)
                    </a>
                </li>
            </div>


            <div class="navbar-nav ml-auto" v-if="!currentUser">
                <li class="nav-item">
                    <a href="/register" class="nav-link">
                        <font-awesome-icon icon="user"/>
                        Регистрация
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/login" class="nav-link">
                        <font-awesome-icon icon="sign-in-alt"/>
                        Вход
                    </a>
                </li>
            </div>
            <div class="navbar-nav ml-auto" v-if="currentUser">
                <li class="nav-item">

                    <a href="/profile" class="nav-link">
                        <font-awesome-icon icon="user"/>
                        <b v-if="currentUser.typeUser === 'specialist'"> @</b>{{currentUser.username}}
                    </a>
                </li>
                <li class="nav-item">
                    <a @click="logOut" class="nav-link">
                        <font-awesome-icon icon="sign-out-alt"/>
                        Выход
                    </a>
                </li>
            </div>
        </nav>
        <div class="container">
            <div v-if="alert.message" :class="alertStyle">
                {{alert.message}}
            </div>
            <router-view/>
            <!--            <b-button id="show-btn" @click="$bvModal.show('bv-modal-example')" >Open Modal</b-button>-->

            <b-modal no-close-on-esc no-close-on-backdrop hide-header-close id="bv-modal-example" hide-footer>
                <template v-slot:modal-title>
                    <h3>Заполните необходимые данные</h3>
                </template>
                <div>
                    <form name="form" @submit.prevent="handleRegister">
                        <b-card bg-variant="light">
                            <b-form-group
                                    label-cols-lg="3"
                                    label="Личные данные"
                                    label-size="lg"
                                    label-class="font-weight-bold pt-0"
                                    class="mb-0"
                            >
                                <b-form-group
                                        label-cols-sm="3"
                                        label="Имя:"
                                        label-align-sm="right"
                                        label-for="nested-firstName"
                                >
                                    <input
                                            type="text"
                                            class="form-control"
                                            name="firstName"
                                            v-model="user.firstName"
                                            v-validate="'required'"
                                    />
                                    <div
                                            class="alert alert-danger"
                                            role="alert"
                                            v-if="errors.has('firstName')"
                                    >firstName is required.
                                    </div>
                                </b-form-group>

                                <b-form-group
                                        label-cols-sm="3"
                                        label="Фамилия:"
                                        label-align-sm="right"
                                        label-for="nested-lastName"
                                >
                                    <input
                                            type="text"
                                            class="form-control"
                                            name="lastName"
                                            v-model="user.lastName"
                                            v-validate="'required'"
                                    />
                                    <div
                                            class="alert alert-danger"
                                            role="alert"
                                            v-if="errors.has('lastName')"
                                    >lastName is required.
                                    </div>
                                </b-form-group>

                                <b-form-group
                                        label-cols-sm="3"
                                        label="Отчество:"
                                        label-align-sm="right"
                                        label-for="nested-middleName"
                                >
                                    <input
                                            type="text"
                                            class="form-control"
                                            name="middleName"
                                            v-model="user.middleName"
                                            v-validate="'required'"
                                    />
                                    <div
                                            class="alert alert-danger"
                                            role="alert"
                                            v-if="errors.has('middleName')"
                                    >middleName is required.
                                    </div>
                                </b-form-group>
                            </b-form-group>
                        </b-card>

                        <b-card class="mt-1" bg-variant="light">
                            <b-container class="form-group row">
                                <button class="btn primary btn-block" :disabled="loading">
                                    <span class="spinner-border spinner-border-sm" v-show="loading"></span>
                                    <span>Сохранить</span>
                                </button>

                            </b-container>

                        </b-card>
                    </form>
                    <b-card class="mt-1" bg-variant="light">
                        <b-button class="mt-3" block @click="logOutAndClose">
                            <span>Выйти</span>
                        </b-button>
                    </b-card>
                </div>
            </b-modal>


        </div>
    </div>
</template>

<script>
    import UserService from "./services/user.service";
    import {User} from "./models/user";

    export default {
        data() {
            return {
                user: new User("", "", "", "", "", "", "", "", "", ""),
                currentUser: null,
                loading: false,
                modalShow: false,
                id: ""
            };
        },
        computed: {
            alert() {
                return this.$store.getters;
            },
            alertStyle() {
                return this.$store.getters.alertStyle;
            }
        },
        mounted() {
            UserService.currentUser.subscribe(data => {
                this.currentUser = data;
                if (this.currentUser) {
                    UserService.getUser((JSON.parse(localStorage.getItem('currentUser')).id).toString()).then(res => {
                        // eslint-disable-next-line no-console
                        this.user = res;
                        // eslint-disable-next-line no-console

                        if (this.user.firstName === null || this.user.lastName === null) {
                            // eslint-disable-next-line no-console
                            console.log("showModal");
                            this.showModal();
                        }
                    });
                }
            });
        },
        created() {
        },
        methods: {
            showModal() {
                this.$bvModal.show('bv-modal-example');
            },
            hideModal() {
                this.$bvModal.hide('bv-modal-example');
            },
            logOutAndClose() {
                UserService.logOut().then(() => {
                    this.hideModal();
                    this.$router.push('/login');
                });
            },
            handleRegister() {
                this.loading = true;
                this.$validator.validateAll();
                if (this.errors.any()) {
                    this.loading = false;
                    return;
                }
                // eslint-disable-next-line no-console
                console.log("OK");
                UserService.updateUser(this.user.id, this.user)
                    .then(() => {
                        this.$router.push('/profile');
                    })
                    .then(() => {
                        this.loading = false;
                        this.hideModal();
                    });
            },
            addTicketPage() {
                this.$router.push(`/tickets/-1`);
            },
            logOut() {
                UserService.logOut().then(response => {
                    // eslint-disable-next-line no-console
                    console.log(response)
                    this.$router.push('/login');
                });
            },
            clearAlert() {
                this.$store.dispatch('clear');
            },
        },
        watch: {
            $route(to, from) {
                // eslint-disable-next-line no-console
                console.log(to, from);
                //   //You can get warning, if you don't use paremeters.
                //     // eslint-disable-next-line no-console
                //  console.log("-----------route  console start--------------");
                //     // eslint-disable-next-line no-console
                //  console.log(to);
                //     // eslint-disable-next-line no-console
                //  console.log(" -> ");
                //     // eslint-disable-next-line no-console
                //  console.log(from);
                //     // eslint-disable-next-line no-console
                //  console.log("------------route  console end-------------");
                this.clearAlert();
            }
        }
    }
</script>

<style>
</style>

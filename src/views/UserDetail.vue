<template>
    <div class="container">
        <div class="py-5 text-center">
            <h2>Новая пользователь</h2>
        </div>
        <form @submit="validateAndSubmit">
            <div v-if="arrayErrors.length">
                <div
                        class="alert alert-warning"
                        v-bind:key="index"
                        v-for="(error, index) in arrayErrors"
                >
                    {{error}}
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 order-md-2 mb-4">
                    <h5 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-muted">Настройки пользователя</span>
                    </h5>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <small class="text-muted">
                                    <div class="mt-3"></div>
                                    <div class="input-group mb-3 mt-3">
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelectTypeUser">Тип
                                                записи</label>
                                        </div>
                                        <select class="custom-select" id="inputGroupSelectTypeUser"
                                                v-model="user.typeUser" name="TypeUser">
                                            <option selected value="1">Клиент</option>
                                            <option value="2">Специалист</option>
                                            <option value="3">Менеджер</option>
                                            <option value="4">Администратор</option>
                                            <option value="5">Руководитель</option>
                                        </select>
                                    </div>
                                </small>
                            </div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-condensed"
                            v-if="user.typeUser === '2'">
                            <div>
                                <small class="text-muted">
                                    <div class="mt-4"></div>
                                    <div class="input-group mb-3 mt-3">
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelectSpecialization">Специализация</label>
                                        </div>
                                        <select class="custom-select" id="inputGroupSelectSpecialization"
                                                v-model="user.specialization" name="Specialization">
                                            <option selected value="1">Техник</option>
                                            <option value="2">Монтажник</option>
                                            <option value="3">Инженер</option>
                                            <option value="4">Программист</option>
                                            <option value="5">Консультант 1С</option>
                                        </select>
                                    </div>
                                </small>
                            </div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <small class="text-muted">
                                    <div class="form-group">
                                        <label for="email">Электронная почта*</label>
                                        <input
                                                type="email"
                                                class="form-control"
                                                name="email"
                                                v-model="user.email"
                                        />
                                    </div>
                                </small>
                            </div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <small class="text-muted">
                                    <div class="form-group">
                                        <label for="password">Password*</label>
                                        <input
                                                type="password"
                                                class="form-control"
                                                name="password"
                                                v-model="user.password"
                                        />
                                    </div>
                                    <div class="form-group"></div>
                                </small>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-md-4 order-md-2 mb-4">
                    <h5 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-muted">Основная информация</span>
                    </h5>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <small class="text-muted">
                                    <div class="form-group">
                                        <label for="username">Логин*</label>
                                        <input
                                                type="text"
                                                class="form-control"
                                                name="username"
                                                v-model="user.username"
                                        />
                                    </div>
                                    <div class="form-group"></div>
                                </small>
                            </div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <small class="text-muted">
                                    <div class="form-group">
                                        <label for="firstName">Имя*</label>
                                        <input
                                                type="text"
                                                class="form-control"
                                                name="firstName"
                                                v-model="user.firstName"
                                        />
                                    </div>
                                </small>
                            </div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <small class="text-muted">
                                    <div class="form-group">
                                        <label for="lastName">Фамилия*</label>
                                        <input
                                                type="text"
                                                class="form-control"
                                                name="lastName"
                                                v-model="user.lastName"
                                        /
                                    </div>
                                </small>
                            </div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                            <div>
                                <small class="text-muted">
                                    <div class="form-group">
                                        <label for="middleName">Отчество</label>
                                        <input
                                                type="text"
                                                class="form-control"
                                                name="middleName"
                                                v-model="user.middleName"
                                        />
                                    </div>
                                    <div class="form-group"></div>
                                </small>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-success" :disabled="loading">
                    <span class="spinner-border spinner-border-sm" v-show="loading"></span>
                    <span>Выполнить</span>
                </button>
            </div>
        </form>
        <footer class="my-5 pt-5 text-muted text-center text-small">
            <p class="mb-1">© 2017-2018 Company Name</p>
            <ul class="list-inline">
                <li class="list-inline-item"><a href="#">Privacy</a></li>
                <li class="list-inline-item"><a href="#">Terms</a></li>
                <li class="list-inline-item"><a href="#">Support</a></li>
            </ul>
        </footer>
    </div>
</template>

<script>
    import UserService from '../services/user.service';
    import {User} from '../models/user'

    export default {
        name: "userDetails",
        data() {
            return {
                user: new User("", "", "", "", "", "", "", "", ""),
                loading: false,
                arrayErrors: []
            };
        },
        computed: {
            id() {
                return this.$route.params.id;
            },
        },
        watch: {},
        methods: {


            validateAndSubmit(e) {
                e.preventDefault();
                this.arrayErrors = [];
                if (this.arrayErrors.length === 0) {
                    if (this.id === -1) {
                        UserService.register(this.user)
                            .then(
                                data => {
                                    //You can get warning, if you don't use paremeters.
                                    // eslint-disable-next-line no-console
                                    console.log(data);
                                    this.$store.dispatch("success", "Mission is completed.");
                                    setTimeout(() => {
                                        this.$router.push("/users");
                                    }, 1000);
                                },
                                error => {
                                    if (!error.response) {
                                        this.$store.dispatch("error", error);
                                    } else if (error.response.status === 409) {
                                        this.$store.dispatch("error", "Имя пользователя существует");
                                    } else {
                                        this.$store.dispatch("error", "Unexpected error occurred.");
                                    }
                                }
                            )
                            .then(() => {
                                this.$router.push('/users');
                            });
                    } else {
                        UserService.updateUser(this.id, this.user)
                            .then(() => {
                                this.$router.push('/users');
                            });
                    }
                    //     if (this.id === -1) {
                    //   UserService.register(this.user)
                    //           .then(
                    //                   data => {
                    //                     //You can get warning, if you don't use paremeters.
                    //                     // eslint-disable-next-line no-console
                    //                     console.log(data);
                    //                     this.$store.dispatch("success", "Mission is completed.");
                    //                     setTimeout(() => {
                    //                       this.$router.push("/users");
                    //                     }, 1000);
                    //                   },
                    //                   error => {
                    //                     if (!error.response) {
                    //                       this.$store.dispatch("error", error);
                    //                     } else if (error.response.status === 409) {
                    //                       this.$store.dispatch("error", "Имя пользователя существует");
                    //                     } else {
                    //                       this.$store.dispatch("error", "Unexpected error occurred.");
                    //                     }
                    //                   }
                    //           )
                    //           .then(() => {
                    //             this.$router.push('/users');
                    //           });
                    //
                    // } else {
                    //   UserService.updateUser(this.id, this.user)
                    //           .then(
                    //                   data => {
                    //                     //You can get warning, if you don't use paremeters.
                    //                     // eslint-disable-next-line no-console
                    //                     console.log(data);
                    //                     this.$store.dispatch("success", "Mission is completed.");
                    //                     // setTimeout(() => {
                    //                     //   this.$router.push("/users");
                    //                     // }, 1000);
                    //                   },
                    //                   error => {
                    //                     if (!error.response) {
                    //                       this.$store.dispatch("error", error);
                    //                     }
                    //                     {
                    //                       this.$store.dispatch("error", "Unexpected error occurred.");
                    //                     }
                    //                   }
                    //           ).then(() => {
                    //     this.$router.push('/courses');
                    //   });
                    //
                    //}
                }
            },


            refreshCourseDetails() {
                UserService.getUser(this.id).then(res => {
                    // eslint-disable-next-line no-console
                    console.log(res);
                    this.user = res;
                });
            },
        },
        created() {
            this.user.typeUser = "1";
            this.user.specialization = "1";
            if (this.id !== "-1") {
                this.refreshCourseDetails();
            }
        },
    };
</script>

<style>
</style>
<template>
    <div>
        <div class="container row">
            <div class="col m-1">
                <b-button-toolbar key-nav aria-label="Toolbar with search">

                    <b-input-group size="sm">
                        <b-form-input
                                v-model="filter"
                                type="search"
                                id="filterInput"
                                placeholder="Введите название"
                        ></b-form-input>
                        <b-input-group-append>

                            <b-button class="mr-1" :disabled="!filter" @click="clear()"> X</b-button>
                            <b-button @click="getAllUsers(true)">Поиск</b-button>

                        </b-input-group-append>
                    </b-input-group>
                </b-button-toolbar>
            </div>
            <div class="col m-1">
                <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                    <b-button-group size="sm" class="mx-1">
                        <b-button class="mr-1" @click="firstPage()">&laquo;</b-button>
                        <b-button class="mr-1" @click="prevPage()">&lsaquo;</b-button>
                        <b-button>{{ currentPage+1 }} из {{ pages }}</b-button>
                        <b-button class="ml-1" @click="nextPage()">&rsaquo;</b-button>
                        <b-button class="ml-1" @click="lastPage()">&raquo;</b-button>
                    </b-button-group>

                </b-button-toolbar>
            </div>
            <div class="col m-1">
                <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                    <b-button-group size="sm" class="mx-1">
                        <b-button class="mr-1" @click="minusItemsForPage()">-</b-button>
                        <b-button>{{ usersForPage }}</b-button>
                        <b-button class="ml-1" @click="plusItemsForPage()">+</b-button>
                    </b-button-group>

                </b-button-toolbar>
            </div>
        </div>
        <div>
            <b-table
                    ref="selectableTable"
                    selectable
                    :select-mode="selectMode"
                    @row-selected="onRowSelected"
                    :items="users"
                    :fields="fields"
                    striped responsive="sm"
            >
                <template v-slot:cell(#)="row">
                    {{row.index+1}}
                </template>
                <template v-slot:cell(логин)="row">
                    <b>@{{row.item.username}}</b>
                </template>
                <template v-slot:cell(ИФО)="row">
                    {{row.item.lastName}} {{row.item.firstName}} {{row.item.middleName}}
                </template>
                <template v-slot:cell(подробности)="row">
                    <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                        {{ row.detailsShowing ? 'скрыть' : 'показать'}}
                    </b-button>

                </template>

                <template v-slot:cell(открыть)="row">
                    <b-button size="sm" @click="openUserClicked(row.item.id)" class="mr-2">
                        открыть
                    </b-button>

                </template>

                <template v-slot:cell(обновить)="row">
                    <b-button size="sm" @click="updateUserClicked(row.item.id)" class="mr-2">
                        обновить
                    </b-button>
                </template>
                <template v-slot:cell(удалить)="row">
                    <b-button size="sm" @click="deleteUser(row.item.id)" class="mr-2">
                        удалить
                    </b-button>

                </template>
                <template v-slot:row-details="row">
                    <div class="form-group">
                        <b-form-row>
                            <!--              <label for="exampleFormControlTextarea3">Создал:</label>-->
                            <!--              <b-input :value="row.item.sender_username" disabled></b-input>-->
                            <!--              <label for="exampleFormControlTextarea3">Описание:</label>-->
                            <!--              <textarea disabled v-text="row.item.description" class="form-control" id="exampleFormControlTextarea3" rows="3"></textarea>-->
                        </b-form-row>
                    </div>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
    import UserService from "../services/user.service";
    import {User} from "../models/user";

    export default {
        name: "userList",
        data() {
            return {
                selectMode: 'single',
                filter: "",
                per_page: 10,
                currentPage: 0,
                usersForPage: 5,
                totalUsersDB: 10,
                fields: ['#', 'логин', 'ИФО', 'подробности', 'открыть', 'обновить', 'удалить'],
                selected: null,
                loading: false,
                is: false,
                users: [],
                currentUser: new User()
            };
        },
        mounted() {
            this.currentUser = JSON.parse(localStorage.getItem('detailUser'));

            UserService.currentUser.subscribe(data => {
                this.currentUser = data;
                if (data !== null) {
                    this.getAllUsers();
                    // eslint-disable-next-line no-console
                    //console.log(this.getAllUserSpecialist());
                }
            });

        },
        computed: {
            pages() {
                return Math.ceil(this.totalUsersDB / this.usersForPage);
            }
        },
        methods: {

            getAllUsers(defaultSearch) {
                if (defaultSearch === "defaultSearch") {
                    this.defaultSearch();
                }
                let options = {
                    params: {
                        per_page: this.usersForPage,
                        page: this.currentPage,
                        filter: this.filter
                    }
                };
                if (this.filter === "") {
                    this.getLengthUserList();
                    UserService.findAllUsers(options, true).then(res => {

                        if (this.currentUser === null) {
                            this.users = [];
                            this.$router.push("/login");
                        } else {

                            // eslint-disable-next-line no-console
                            this.users = res.data;

                            // this.totalTickets = parseInt(res.headers.get('x-total'))
                        }
                        // eslint-disable-next-line no-console
                    }, console.log);
                } else {
                    this.getLengthUsersListForSearch();
                    UserService.findAllBySearch(options, true).then(res => {
                        if (this.currentUser === null) {
                            this.users = [];
                            this.$router.push("/login");
                        } else {
                            // eslint-disable-next-line no-console
                            this.users = res.data;
                        }
                        // eslint-disable-next-line no-console
                    }, console.log);
                }
            },
            logOut() {
                UserService.logOut().then(() => {
                    this.$router.push('/login');
                });
            },
            deleteUser(id) {
                UserService.deleteUser(id).then((response) => {
                    if (response.status === 200) {
                        // eslint-disable-next-line no-console
                        console.log("Пользователь удален")
                        if (this.currentUser.id === id) {
                            console.log("Вы сами удалил свою учетную запись, бай бай!")
                            this.logOut();
                        }
                    }
                    this.getAllUsers();
                });
            },
            getLengthUsersListForSearch() {
                let options = {
                    params: {
                        per_page: "",
                        page: "",
                        filter: this.filter
                    }
                };
                UserService.findAllBySearch(options, false).then(res => {
                    this.totalUsersDB = res.data.length;
                }, console.log);
            },
            getLengthUserList() {
                let options = {
                    params: {
                        per_page: this.usersForPage,
                        page: this.currentPage,
                        filter: ""
                    }
                };
                UserService.findAllUsers(options, false).then(res => {
                    this.totalUsersDB = res.data.length;

                }, console.log);
            },
            updateUserClicked(id) {
                this.$router.push(`/users/${id}`);
            },
            addUserClicked() {
                this.$router.push(`/users/-1`);
            },
            openUserClicked(id) {
                this.$root.$emit('open_userDetail', id);
                this.$router.push({path: `/users/${id}`})
            },
            onRowSelected(items) {
                if (items[0]) {
                    this.selected = items[0].id
                } else {
                    this.selected = null;
                }
                console.log(this.selected);
            },
            defaultSearch() {
                this.currentPage = 0;
                this.per_page = 10;
            },
            clear() {
                this.filter = "";
                this.defaultSearch();
                this.getAllUsers();
            },
            changeUsersForPage(val) {
                console.log(val);
                this.usersForPage = val;
                this.getAllUsers();
            },
            nextPage() {
                if (this.currentPage < this.pages - 1) {
                    this.currentPage += 1
                    this.getAllUsers();
                }
                console.log("nextPage");
                this.console();
            },
            prevPage() {
                if (this.currentPage !== 0) {
                    this.currentPage -= 1
                    this.getAllUsers();
                }
                console.log("prevPage");
                this.console();
            },
            firstPage() {
                this.currentPage = 0;
                this.getAllUsers();
            },
            lastPage() {
                this.currentPage = this.pages - 1;
                this.getAllUsers();
            },
            minusItemsForPage() {
                if (this.usersForPage !== 1) {
                    this.usersForPage -= 1;
                } else if (this.currentPage !== 0) {
                    this.currentPage -= 1
                }
                this.getAllUsers();
                console.log("minusItemsForPage");
                this.console();
            },
            console() {
                console.log("страниц:" + this.pages, "текущая:" + ((this.currentPage + 1) + " "), "всех:" + this.totalUsersDB, "на странице:" + this.usersForPage);
            },
            plusItemsForPage() {
                // if(((this.currentPage+1)*this.ticketsForPage) === this.totalTicketsDB){
                //   console.log("бум");
                // }
                if (this.pages > this.currentPage + 1) {
                    this.usersForPage += 1;
                    // if((this.totalTicketsDB - (this.ticketsForPage*this.currentPage+1))<0){
                    //}
                    this.getAllUsers();
                }
                console.log("plusItemsForPage");
                this.console();
            }
        }
    };
</script>

<style scoped>

</style>


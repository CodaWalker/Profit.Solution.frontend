<template>
    <div class="container">
        <div class="py-5 text-center" v-if="id < 1">
            <h2>Новая заявка</h2>
        </div>
        <div class="py-5 text-center" v-else-if="id > 0">
            <h2>Редактирование заявки</h2>
        </div>
        <div class="row">
            <div class="col-md-4 order-md-2 mb-4">
                <h4 class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">Заказчик</span>
                </h4>
                <ul class="list-group mb-3">
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 class="my-0">ФИО</h6>
                            <small class="text-muted">{{ticket.sender_username}}</small>
                        </div>
                    </li>
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 class="my-0">Адрес</h6>
                            <small class="text-muted">г.Москва, ул. Кулакова, 20 корп. А1</small>
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm">Изменить</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                            <h6 class="my-0">Предыдущий заказ</h6>
                            <small class="text-muted">Монтаж ЛВС, Настройка интернета</small>
                        </div>
                        <span class="text-muted">2 часа</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between bg-light">
                        <h6 class="my-0">Рейтинг</h6>
                        <span class="text-muted">67</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <div class="text-success">
                            <h6 class="my-0">Кошелек</h6>
                        </div>
                        <span class="text-success">5000 Р</span>
                    </li>
                </ul>
                <form class="card p-2">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Promo code">
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-secondary">Redeem</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-md-8 order-md-1">
                <h4 class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">Описание заявки</span>
                </h4>
                <form name="form" class="needs-validation" @submit.prevent="handleCrateTicket" novalidate="">
                    <div class=" form-group mb-3">
                        <label class="StatusTicket">Статус</label>
                        <multi-select id="StatusTicket" v-model="ticket.status" :options="statusList"
                                      :searchable="false"
                                      :close-on-select="true" :show-labels="false" placeholder="Выбери статус"
                                      :disabled="statusSwitchDisable"/>
                    </div>
                    <div class=" form-group mb-3">
                        <label for="title">Название <span class="text-muted"/></label>
                        <input :disabled="lockFieldTicketTitleAndDesc"
                               v-model="ticket.title"
                               type="text"
                               class="form-control"
                               name="title"
                               placeholder="Установка windows, Протяжка кабеля интернет, Консультация 1С ...."
                               v-validate="'required'"
                        >
                        <div
                                class="alert alert-danger"
                                role="alert"
                                v-if="errors.has('title')"
                        >Название заявки обязательно.
                        </div>

                        <div class="invalid-feedback">
                            Пожалуйста укажите краткое название заявки.
                        </div>
                    </div>
                    <div class=" form-group mb-3">
                        <b-row>
                            <b-col>
                                <b-button :disabled="lockButtonSender" @click="showModalChangeSender"
                                          ref="showModalChangeSender">Выбрать клиента
                                </b-button>
                            </b-col>
                            <b-col>
                                <div v-if="ticket.sender_username">

                                    <b-form-input disabled
                                                  v-model="ticket.sender_username"
                                                  type="text"
                                    ></b-form-input>
                                </div>
                                <div v-else>
                                    <b-form-input disabled
                                                  type="text"
                                                  value=""
                                    ></b-form-input>
                                </div>
                            </b-col>
                        </b-row>
                        <b-modal id="modal-xl-1" size="xl" title="Выбор клиента">
                            <div class="container">
                                <!--------------------------------------------UserList---START--------------------------------------------------------------------------->
                                <template>
                                    <div>
                                        <div class="container row">
                                            <div class="col m-1">
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
                                                <template v-slot:cell(специализация)="row">
                                                    <b>{{row.item.specialization}}</b>
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
                                                <template v-slot:cell(выбрать)="row">
                                                    <b-button size="sm"
                                                              @click="changeUserClicked(row.item.id,row.item.username)"
                                                              class="mr-2">
                                                        открыть
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
                                <!--------------------------------------------UserList--END---------------------------------------------------------------------------->
                            </div>
                        </b-modal>
                    </div>
                    <div class=" form-group mb-3">
                        <b-row>
                            <b-col>
                                <b-button :disabled="lockButtonRecipient" @click="showModalChangeRecipient"
                                          ref="showModalChangeRecipient">Выбрать исполнителя
                                </b-button>
                            </b-col>
                            <b-col>
                                <div v-if="ticket.recipient_username">

                                    <b-form-input disabled
                                                  v-model="ticket.recipient_username"
                                                  type="text"
                                    ></b-form-input>
                                </div>
                                <div v-else>
                                    <b-form-input disabled
                                                  type="text"
                                                  value=""
                                    ></b-form-input>
                                </div>
                            </b-col>
                        </b-row>

                        <b-modal id="modal-xl" size="xl" title="Выбор исполнителя">
                            <div class="container">
                                <!--------------------------------------------UserList---START--------------------------------------------------------------------------->
                                <template>
                                    <div>
                                        <div class="container row">
                                            <div class="col m-1">
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
                                                <template v-slot:cell(специализация)="row">
                                                    <b>{{row.item.specialization}}</b>
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

                                                <template v-slot:cell(выбрать)="row">
                                                    <b-button size="sm"
                                                              @click="changeUserClicked(row.item.id,row.item.username)"
                                                              class="mr-2">
                                                        открыть
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
                                <!--------------------------------------------UserList--END---------------------------------------------------------------------------->
                            </div>
                        </b-modal>
                    </div>
                    <div class=" form-group mb-3">
                        <b-row>
                            <b-col>
                                <b-button :disabled="lockButtonOperator" @click="showModalChangeOperator"
                                          ref="showModalChangeOperator">Выбор оператора
                                </b-button>
                            </b-col>
                            <b-col>
                                <div v-if="ticket.operator_username">

                                    <b-form-input disabled
                                                  v-model="ticket.operator_username"
                                                  type="text"
                                    ></b-form-input>
                                </div>
                                <div v-else>
                                    <b-form-input disabled
                                                  type="text"
                                                  value=""
                                    ></b-form-input>
                                </div>

                            </b-col>
                        </b-row>
                        <b-modal id="modal-xl-2" size="xl" title="Выбор оператора">
                            <div class="container">
                                <!--------------------------------------------UserList---START--------------------------------------------------------------------------->
                                <template>
                                    <div>
                                        <div class="container row">
                                            <div class="col m-1">
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
                                                <template v-slot:cell(специализация)="row">
                                                    <b>{{row.item.specialization}}</b>
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
                                                <template v-slot:cell(выбрать)="row">
                                                    <b-button size="sm"
                                                              @click="changeUserClicked(row.item.id,row.item.username)"
                                                              class="mr-2">
                                                        открыть
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
                                <!--------------------------------------------UserList--END---------------------------------------------------------------------------->
                            </div>
                        </b-modal>
                    </div>
                    <div class=" form-group mb-3">
                        <label for="description">Описание <span class="text-muted"></span></label>
                        <textarea :disabled="lockFieldTicketTitleAndDesc" v-model="ticket.description"
                                  class="form-control" aria-label="With textarea" id="description" placeholder="......"
                                  required=""></textarea>
                    </div>
                    <hr class="mb-4">
                    <button class="btn primary btn-block" :disabled="loading">
                        <span class="spinner-border spinner-border-sm" v-show="loading"></span>
                        <span>Сохранить</span>
                    </button>
                </form>
            </div>
        </div>
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
    import {Ticket} from '../models/tickets'
    import {User} from '../models/user'
    import TicketService from '../services/ticket.service'
    import UserService from '../services/user.service';
    import Multiselect from 'vue-multiselect'

    export default {
        components: {
            // eslint-disable-next-line vue/no-unused-components
            UserList: () => import('./UserList.vue'),
        },
        comments: {Multiselect},
        name: 'ticketDetail',
        // props:['id'],
        data() {
            return {
                statusSwitchDisable: false,
                value: '',
                // options: ['Select option', 'options', 'selected', 'mulitple', 'label', 'searchable', 'clearOnSelect', 'hideSelected', 'maxHeight', 'allowEmpty', 'showLabels', 'onChange', 'touched'],
                ticket: new Ticket("", "", "", "", "", "", "false", "", "NEW", ""),
                user: new User("", "", "", "", "", "", "", "", ""),
                loading: false,
                disabled: true,
                statusList: [
                    'NEW', 'OPEN', 'IN_PROGRESS', 'CANCELED', 'COMPLETED', 'ARCHIVED', 'DELETED'
                ],
                edit: false,
                //--------------------User List--Start----
                selectMode: 'single',
                filter: "",
                per_page: 10,
                currentPage: 0,
                usersForPage: 5,
                totalUsersDB: 10,
                fields: ['#', 'специализация', 'логин', 'ИФО', 'подробности', 'выбрать'],
                selected: null,
                is: false,
                users: [],
                recipient_username: " не выбран ",
                operator_username: " не выбран ",
                sender_username: " не выбран ",
                manager_username: " не выбран ",
                recipient_id: null,
                operator_id: null,
                sender_id: null,
                manager_id: null,
                currentTicket: {},
                typeUserForGet: "specialist",
                lockButtonSender: false,
                lockButtonRecipient: false,
                lockButtonOperator: false,
                lockFieldTicketTitleAndDesc: false
            };
        },
        watch: {
            // '$route'() {
            //   this.updateProfile()
            // }
        },
        computed: {
            pages() {
                return Math.ceil(this.totalUsersDB / this.usersForPage)
            },
            id() {
                return this.$route.params.id;
            },
        },
        methods: {
            showModalChangeRecipient() {
                this.typeUserForGet = 'specialist';
                this.getAllUsers();
                this.$root.$emit('bv::show::modal', 'modal-xl', '#showModalChangeRecipient')
            },
            showModalChangeOperator() {
                this.typeUserForGet = 'operator';
                this.getAllUsers();
                this.$root.$emit('bv::show::modal', 'modal-xl-2', '#showModalChangeOperator')
            },
            showModalChangeSender() {
                this.typeUserForGet = 'client';
                this.getAllUsers();
                this.$root.$emit('bv::show::modal', 'modal-xl-1', '#showModalChangeSender')
            },
            getAllUserIncludeType() {
                let options = {
                    params: {
                        per_page: this.usersForPage,
                        page: this.currentPage,
                        typeUser: this.typeUserForGet
                    }
                };
                UserService.findAllByType(options, true).then(res => {
                    // eslint-disable-next-line no-console
                    console.log(res.data);
                    // eslint-disable-next-line no-console
                }, console.log);
            },

            handleCrateTicket() {
                this.loading = true;
                this.$validator.validateAll();
                if (this.errors.any()) {
                    this.loading = false;
                    return;
                }
                // eslint-disable-next-line no-console
                console.log("OK TICKET");
                this.createTicket();
                this.loading = false;

            },
            getAllUsers() {
                let options = {
                    params: {
                        per_page: this.usersForPage,
                        page: this.currentPage,
                        typeUser: this.typeUserForGet,
                        filter: this.filter
                    }
                };
                this.getLengthUserList();
                UserService.findAllByType(options, true).then(res => {

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
            },

            getLengthUserList() {
                let options = {
                    params: {
                        per_page: this.usersForPage,
                        page: this.currentPage,
                        typeUser: this.typeUserForGet,
                        filter: ""
                    }
                };
                UserService.findAllByType(options, false).then(res => {
                    this.totalUsersDB = res.data.length;

                }, console.log);
            },
            onRowSelected(items) {
                if (items[0]) {
                    this.selected = items[0].id
                } else {
                    this.selected = null;
                }
                console.log(this.selected);
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
            changeUserClicked(id, username) {
                if (this.typeUserForGet === "specialist") {
                    this.ticket.recipient_username = '@' + username;
                    this.ticket.recipient_id = id;
                }
                if (this.typeUserForGet === "operator") {
                    this.ticket.operator_username = username;
                    this.ticket.operator_id = id;
                }
                if (this.typeUserForGet === "client") {
                    this.ticket.sender_username = username;
                    this.ticket.sender_id = id;
                }
                if (this.typeUserForGet === "manager") {
                    this.ticket.manager_username = username;
                    this.ticket.manager_id = id;
                }
                this.$bvModal.hide('modal-xl');
                this.$bvModal.hide('modal-xl-1');
                this.$bvModal.hide('modal-xl-2');
            },

            createTicket() {
                // eslint-disable-next-line no-console
                if (!this.currentUser) {
                    this.$store.dispatch("error", "You should sign in to enroll a !.");
                    return;
                }
                // eslint-disable-next-line no-console
                if (this.currentUser.typeUser === "client") {
                    this.ticket.sender_id = this.currentUser.id;
                }
                this.ticket.manager_id = this.currentUser.id;
                // this.ticket.recipient_id = this.recipient_id;
                this.ticket.fromAds = false;
                // this.ticket.title = "title";
                // this.ticket.description = "description";
                this.ticket.comment = "comment";
                // this.ticket.status = "NEW";
                // eslint-disable-next-line no-console
                console.log(this.recipient_id);

                TicketService.update(this.id, this.ticket).then(
                    res => {
                        // eslint-disable-next-line no-console
                        console.log(res.data);
                        this.$store.dispatch("success", "Create ticket is completed.");
                        this.disabled = true;
                        setTimeout(() => {
                            this.$router.push("/my-tickets");
                        }, 3000);
                    },
                    error => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                        this.$store.dispatch("error", "Create ticket error occurred.");
                    }
                );
            },

            refreshTicketDetails() {
                TicketService.getTicket(this.id).then(res => {
                    // eslint-disable-next-line no-console
                    console.log(res);
                    this.ticket = res;
                    if (this.ticket.status === "COMPLETED") {
                        this.statusSwitchDisable = true;
                        this.lockFieldTicketTitleAndDesc = true;
                    }
                    if (this.ticket.sender_id.length > 10) {
                        this.lockFieldTicketTitleAndDesc = true;
                    }
                    if (this.ticket.sender_id === this.currentUser.id) {
                        this.loading = true;
                    }
                });
            }
        },
        refreshCourseDetails() {
            if (this.user.id) {
                UserService.getUser(this.user.id).then(res => {
                    // eslint-disable-next-line no-console
                    console.log(res);
                    this.user = res;
                });
            }
        },
        mounted() {
            // this.getAllUserIncludeType();
            this.currentUser = JSON.parse(localStorage.getItem('detailUser'));
            UserService.currentUser.subscribe(data => {
                this.currentUser = data;
                if (data !== null) {
                    this.getAllUsers();
                }
            });
            this.$root.$on('edit', function (id) {
                if (id.length > 5) {
                    this.edit = true;
                    //if(this.ticket.status !== "NEW") {
                    // this.statusSwitchDisable = false; //редактирование статуса
                    //}
                }
            });

        },
        created() {
            if (this.$route.params.id === "-1") {
                this.statusSwitchDisable = true;
            }
                // else if(this.currentUser.typeUser === 'client'){
                //     this.statusSwitchDisable = true;
                //     this.refreshTicketDetails();
            //   }
            else {
                this.refreshTicketDetails();
            }
            UserService.currentUser.subscribe(data => {
                this.currentUser = data;
                if (this.currentUser.typeUser === 'client') {
                    this.statusSwitchDisable = true;
                    this.lockButtonSender = true;
                    this.lockButtonRecipient = true;
                    this.lockButtonOperator = true;
                } else if (this.currentUser.typeUser === 'specialist') {
                    this.lockButtonSender = true;
                    this.lockButtonRecipient = true;
                    this.lockButtonOperator = true;
                }
                // this.refreshCourseDetails();
                console.log(this.currentUser);
            });
            // this.currentTicket = JSON.parse(localStorage.getItem('detailCourse'));
            // this.ticketId = this.$route.params.id;
            //
            // CourseService.filterStudents(this.courseId).then(users => {
            //   this.users = users.data;
            // });
        },
        beforeMount() {
            // this.updateProfile()
        }
    }

</script>

<style scoped>

</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


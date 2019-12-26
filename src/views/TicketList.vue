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
                    placeholder="По названию"
            ></b-form-input>
            <b-input-group-append>

              <b-button class="mr-1" :disabled="!filter" @click="clear()"> X </b-button>
              <b-button @click="getTickets('defaultSearch')">Поиск</b-button>

            </b-input-group-append>
          </b-input-group>
        </b-button-toolbar>
      </div>
      <div class="col m-1">
        <b-button-toolbar key-nav aria-label="Toolbar with button groups">
          <b-button-group size="sm" class="mx-1">
            <b-button  class="mr-1" @click="firstPage()">&laquo;</b-button>
            <b-button  class="mr-1" @click="prevPage()">&lsaquo;</b-button>
            <b-button>{{ currentPage+1 }} из {{ pages }}</b-button>
            <b-button  class="ml-1" @click="nextPage()">&rsaquo;</b-button>
            <b-button  class="ml-1"  @click="lastPage()">&raquo;</b-button>
          </b-button-group>

        </b-button-toolbar>
      </div>
      <div class="col m-1">
        <b-button-toolbar key-nav aria-label="Toolbar with button groups">
          <b-button-group size="sm" class="mx-1">
            <b-button  class="mr-1" @click="minusItemsForPage()">-</b-button>
            <b-button>{{ ticketsForPage }}</b-button>
            <b-button  class="ml-1" @click="plusItemsForPage()">+</b-button>
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
            :items="tickets"
            :fields="fields"

            striped responsive="sm"
    >
      <template v-slot:cell(статус)="row">
        <b>{{row.item.status}}</b>
      </template>
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Скрыть' : 'Показать'}} детали
        </b-button>

      </template>

      <template v-slot:cell(открыть)="row">
        <b-button size="sm" @click="openTicketClicked(row.item.id)" class="mr-2">
         открыть
        </b-button>

      </template>

      <template v-slot:cell(выбрать)="row">
        <b-button size="sm" @click="openTicketClicked(row.item.id)" class="mr-2">
          выбрать
        </b-button>

      </template>
      <template v-slot:row-details="row">
        <div class="form-group">
          <b-form-row>
          <label for="exampleFormControlTextarea3">Создал:</label>
          <b-input :value="row.item.sender_username" disabled></b-input>
          <label for="exampleFormControlTextarea3">Описание:</label>
          <textarea disabled v-text="row.item.description" class="form-control" id="exampleFormControlTextarea3" rows="3"></textarea>
          </b-form-row>
        </div>
      </template>
    </b-table>
</div>
  </div>
</template>

<script>
   import TicketService from "../services/ticket.service";
   import UserService from "../services/user.service";

  export default {

    data() {
      return {
        selectMode: 'single',
        filter:"",
        per_page:10,
        currentPage:0,
        ticketsForPage:5,
        totalTicketsDB:10,
        tickets:[],
        fields: ['number', 'статус','title', 'show_details','открыть','выбрать'],
        selected: null,
      }
    },
    mounted(){
      this.getTickets();
      let options = {
        params: {
          per_page: 10,
          page: 0,
        }
      };

      //
      // TicketService.findBySender(options,id).then(res => {
      //   if (this.currentUser === null) {
      //     this.tickets = [];
      //     this.$router.push("/login");
      //   } else {
      //     // eslint-disable-next-line no-console
      //     this.tickets = res.data;
      //
      //     // this.totalTickets = parseInt(res.headers.get('x-total'))
      //   }
      //   // eslint-disable-next-line no-console
      // }, console.log);

    },
    computed:{
      pages(){return  Math.ceil(this.totalTicketsDB/this.ticketsForPage);}
    },
    methods:{
      onRowSelected(items) {
        if(items[0]) {
          this.selected = items[0].id
        }
        else{
          this.selected = null;
        }
         console.log(this.selected);
      },
      defaultSearch(){

        this.currentPage = 0;
        this.per_page = 10;
      },
      clear(){
        this.filter = "";
        this.defaultSearch();
        this.getTickets();
      },

      nextPage(){


        if(this.currentPage < this.pages-1) {
           this.currentPage += 1
             this.getTickets();
         }
        console.log("nextPage");
        this.console();
      },
      prevPage(){


        if(this.currentPage !== 0) {
          this.currentPage -= 1
            this.getTickets();
        }
        console.log("prevPage");
        this.console();
      },
      firstPage(){
        this.currentPage = 0;
        this.getTickets();
      },
      lastPage(){
      this.currentPage = this.pages-1;
      this.getTickets();
      },
      minusItemsForPage(){

        if(this.ticketsForPage !== 1) {
           this.ticketsForPage -= 1;
         }else if(this.currentPage !== 0){
          this.currentPage -= 1
        }
          this.getTickets();
        console.log("minusItemsForPage");
        this.console();
         },
      console(){
        console.log("страниц:"+this.pages,"текущая:"+((this.currentPage+1)+" "),"всех:"+this.totalTicketsDB,"на странице:"+this.ticketsForPage);
      },
      plusItemsForPage(){

        // if(((this.currentPage+1)*this.ticketsForPage) === this.totalTicketsDB){
        //   console.log("бум");
        // }
        if(this.pages > this.currentPage+1){
          this.ticketsForPage += 1;
         // if((this.totalTicketsDB - (this.ticketsForPage*this.currentPage+1))<0){
          //}
            this.getTickets();
         }
        console.log("plusItemsForPage");
        this.console();
      },
      getTickets(defaultSearch){
        // eslint-disable-next-line no-console
        if(defaultSearch === "defaultSearch"){
          this.defaultSearch();
        }
        let options = {
          params: {
            per_page: this.ticketsForPage,
            page: this.currentPage,
            filter: this.filter
          }
        };
        if(this.filter === ""){
          this.getLengthTicketList();
          TicketService.findAllTickets(options, true).then(res => {

            if (this.currentUser === null) {
              this.tickets = [];
              this.$router.push("/login");
            } else {
              // eslint-disable-next-line no-console
              this.tickets = res.data;

              // this.totalTickets = parseInt(res.headers.get('x-total'))
            }
            // eslint-disable-next-line no-console
          }, console.log);
        }else{
          this.getLengthTicketsListForSearch();
          TicketService.findAllBySearch(options,true).then(res => {
            if (this.currentUser === null) {
              this.tickets = [];
              this.$router.push("/login");
            } else {
              // eslint-disable-next-line no-console
              console.log(res);
              this.tickets = res.data;
            }
            // eslint-disable-next-line no-console
          }, console.log);
        }

      },

      // findAllBySearch(){
      //   if(this.filter === ""){
      //     this.getTickets();
      //   }else {
      //     let options = {
      //       params: {
      //         per_page: this.ticketsForPage,
      //         page: this.currentPage,
      //         filter: this.filter
      //       }
      //     };
      //     TicketService.findAllBySearch(options,true).then(res => {
      //
      //       if (this.currentUser === null) {
      //         this.tickets = [];
      //         this.$router.push("/login");
      //       } else {
      //         // eslint-disable-next-line no-console
      //         console.log(res);
      //         this.tickets = res.data;
      //       }
      //       // eslint-disable-next-line no-console
      //     }, console.log);
      //   }
      // },

      getLengthTicketsListForSearch(){
        let options = {
          params: {
            per_page: "",
            page: "",
            filter: this.filter
          }
        };
          TicketService.findAllBySearch(options, false).then(res => {
              this.totalTicketsDB = res.data.length;
          }, console.log);
        // console.log(this.totalTicketsDB);
      },

      getLengthTicketList() {
        let options = {
          params: {
            per_page: this.ticketsForPage,
            page: this.currentPage,
            filter: ""
          }
        };
        TicketService.findAllTickets(options, false).then(res => {
          this.totalTicketsDB = res.data.length;
        }, console.log);
      },

      deleteTicket(id) {
        TicketService.deleteUser(id).then((response) => {
          if(response.status === 200){
            console.log("Пользователь удален")
            if(this.currentUser.id === id){
              console.log("Вы сами удалил свою учетную запись, бай бай!")
              this.logOut();
            }
          }
          this.getAllUsers();
        });
      },

      updateUserClicked(id) {
        this.$router.push(`/users/${id}`);
      },
      addUserClicked(){
        this.$router.push(`/users/-1`);
      },
      openUserClicked(id) {
        //this.$router.push(`/users/${id}`);
        this.$router.push({ path: `/users/${id}`})
      },
      openTicketClicked(id) {
        this.$root.$emit('edit', id);
        this.$router.push({ path: `/tickets/${id}`})
      },
    }
  }
</script>
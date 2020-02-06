import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Detail from './views/Detail.vue'
import UserDetail from './views/UserDetail.vue'
import UserList from "./views/UserList";
import TicketDetail from "./views/TicketDetail";
import TicketList from "./views/TicketList";
import MyTicketList from "./views/MyTicketList";

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: () => import('./views/Profile.vue')
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/users',
            component: UserList,
        },
        {
            path: '/users/:id',
            name: 'userDetail',
            component: UserDetail
        },
        {
            path: '/my-tickets',
            name: 'myTicketList',
            component: MyTicketList,
        },
        {
            path: '/tickets',
            name: 'ticketList',
            component: TicketList,
        },
        {
            path: '/tickets/:id',
            name: 'ticketDetail',
            component: TicketDetail
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/Profile.vue')
        },
        {
            path: '/detail/:id',
            name: 'detail',
            component: Detail
        },
        {
            path: '**',
            component: Home
        }
    ]
})

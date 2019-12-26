import axios from 'axios';
import {BehaviorSubject} from 'rxjs';


const API_URL = 'http://localhost:9000/service';
const API_CRUD_URL = 'http://localhost:9000/api';

const instance = axios.create({
    
    baseURL: API_CRUD_URL,
    timeout: 1000
});

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

class UserService {
    get currentUserValue(){
        return currentUserSubject.value;
    }

    get currentUser(){
        return currentUserSubject.asObservable();
    }

    login(user) {
        const headers = {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)
        };
        return axios.get(API_URL + '/login', {headers: headers}).then(response => {
            if(response.status === 200){
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                currentUserSubject.next(response.data);
            }
        });
    }



    logOut() {
        return axios.post(API_URL + '/logout', {}).then(response => {
            if(response.status === 200) {
                localStorage.removeItem('currentUser');
                currentUserSubject.next(null);
                return "LOGOUT OK"
            }else{
                return "LOGOUT ERROR"
            }
        });
    }

    register(user) {
        return axios.post(API_URL + '/register', JSON.stringify(user),
        {headers: {'Content-Type':'application/json; charset=UTF-8'}});
    }

    //eslint-disable-next-line no-unused-vars
    // register(user) {
    //     return axios.post(API_CRUD_URL + '/users/create', JSON.stringify(user),
    //         {headers: {'Content-Type':'application/json; charset=UTF-8'}});
    // }

    deleteTicket(user){
        const url = `${API_URL}/tickets/${user.pk}`;
        return axios.delete(url);
    }

    updateUser(id,user) {
        return axios.post(API_CRUD_URL +`/users/${id}`, JSON.stringify(user),
            {headers: {'Content-Type':'application/json; charset=UTF-8'}});
    }

    // findAllUsers() {
    //     return instance.get('/users/all', {headers: {'Content-Type':'application/json; charset=UTF-8'}});
    // }

    findAllUsers(options,Pages) {
        if(Pages === false){
            return axios.get(`${API_CRUD_URL}/users/all`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
        else if(options.params.per_page != null || options.params.page != null) {
            return axios.get(`${API_CRUD_URL}/users/all/pagination?pageSize=${options.params.per_page}&pageNo=${options.params.page}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }else{
            return axios.get(API_CRUD_URL+'/users/all/pagination', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
    }
    findAllUsersClient(options,Pages) {
        if(Pages === false){
            return axios.get(`${API_CRUD_URL}/users/all`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
        else if(options.params.per_page != null || options.params.page != null) {
            return axios.get(`${API_CRUD_URL}/users/all/pagination?pageSize=${options.params.per_page}&pageNo=${options.params.page}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }else{
            return axios.get(API_CRUD_URL+'/users/all/pagination', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
    }
    findAllByType(options,Pages){ ///all&typeUser={typeUser}/pagination
        if(Pages === false) {
            return axios.get(`${API_CRUD_URL}/users/all&typeUser=${options.params.typeUser}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }else if(options.params.per_page != null || options.params.page != null){
            return axios.get(`${API_CRUD_URL}/users/all&typeUser=${options.params.typeUser}/pagination?pageSize=${options.params.per_page}&pageNo=${options.params.page}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
    }
    findAllBySearchByType(options) {
            return axios.get(`${API_CRUD_URL}/users/search&typeUser=${options.params.typeUser}/${options.params.filter}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        // return axios.get(`${API_CRUD_URL}/tickets/search/${string}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    findAllBySearch(options,Pages) {

        if(Pages === false){
            return axios.get(`${API_CRUD_URL}/users/search/${options.params.filter}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
        else if(options.params.per_page != null || options.params.page != null ) {
            return axios.get(`${API_CRUD_URL}/users/search/${options.params.filter}?pageSize=${options.params.per_page}&pageNo=${options.params.page}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }else{
            return axios.get(API_CRUD_URL+'/users/all/pagination', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }

        // return axios.get(`${API_CRUD_URL}/tickets/search/${string}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }















    getUser(pk) {
        // eslint-disable-next-line no-console
        const url = `/users/${pk}`;
        return instance.get(url).then(response => response.data);
    }


    deleteUser(id){
        const url = `/users/${id}`;
        return instance.delete(url);
    }
}

export default new UserService();
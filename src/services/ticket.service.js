import axios from 'axios';
import {BehaviorSubject} from 'rxjs';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


const API_URL = 'http://localhost:9000/service';
const API_CRUD_URL = 'http://localhost:9000/api';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

class TicketService {
    get currentUserValue(){
        return currentUserSubject.value;
    }

    get currentUser(){
        return currentUserSubject.asObservable();
    }
    getMyTickets(options,Pages){
        let id = this.currentUserValue.id;

        if(Pages === false){
            return axios.get(`${API_CRUD_URL}/tickets/my-tickets/${id}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
        else if(options.params.per_page != null || options.params.page != null) {
            return axios.get(`${API_CRUD_URL}/tickets/my-tickets/${id}/pagination?pageSize=${options.params.per_page}&pageNo=${options.params.page}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }else{
            return axios.get(`${API_CRUD_URL}/tickets/my-tickets/${id}/pagination`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }


    }
    findAllTickets(options,Pages) {

        if(Pages === false){
            return axios.get(`${API_CRUD_URL}/tickets/all`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
        else if(options.params.per_page != null || options.params.page != null) {
            return axios.get(`${API_CRUD_URL}/tickets/all/pagination?pageSize=${options.params.per_page}&pageNo=${options.params.page}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }else{
            return axios.get(API_CRUD_URL+'/tickets/all/pagination', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
    }

    getTicket(pk) {
        const url = `${API_CRUD_URL}/tickets/${pk}`;
        return axios.get(url).then(response => response.data);
    }
    update(id,ticket) {
        // eslint-disable-next-line no-console
        // eslint-disable-next-line no-console
            if(id === "-1"){
                // eslint-disable-next-line no-console
                console.log("create");
                console.log(ticket);
                ticket.id = null;
                return axios.post(API_CRUD_URL + '/tickets/create', JSON.stringify(ticket),
                    {headers: {'Content-Type':'application/json; charset=UTF-8'}});
            }
            else{
                // eslint-disable-next-line no-console
                console.log("update");
                return axios.put(`${API_CRUD_URL}/tickets/${id}/update`,ticket);
            }
    }

    deleteTicket(ticket){
        const url = `${API_URL}/tickets/${ticket.pk}`;
        return axios.delete(url);
    }

    // findBySender(options,sender_id){
    //     return axios.get(`${API_CRUD_URL}/tickets/findAllBySender?pageSize=${options.params.per_page}&pageNo=${options.params.page}&sender_id=${sender_id}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    // }
    findAllBySearch(options,Pages) {

        if(Pages === false){
            return axios.get(`${API_CRUD_URL}/tickets/search/${options.params.filter}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }
        else if(options.params.per_page != null || options.params.page != null ) {
            return axios.get(`${API_CRUD_URL}/tickets/search/${options.params.filter}?pageSize=${options.params.per_page}&pageNo=${options.params.page}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }else{
            return axios.get(API_CRUD_URL+'/tickets/all/pagination', {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
        }

            // return axios.get(`${API_CRUD_URL}/tickets/search/${string}`, {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }
}

export default new TicketService();
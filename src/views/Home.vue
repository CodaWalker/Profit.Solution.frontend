<template>
    <div class="container">
        <div v-if="users.length > 0" class="course-container">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col col-xs-6">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import UserService from "../services/user.service";
    import TicketService from "../services/ticket.service";
    import {User} from "../models/user";
    import {Ticket} from "../models/tickets";

    export default {

        name: "home",
        data() {
            return {
                is: false,
                courses: [],
                users: [],
                currentUser: new User()
            };
        },
        created() {
            UserService.currentUser.subscribe(data => {
                this.currentUser = data;
                if (this.currentUser === null) {
                    this.$router.push("/login");
                } else if (this.currentUser == null) {
                    this.$router.push("/login");
                }
            });

        },
        methods: {
            enroll(ticket) {
                if (!this.currentUser) {
                    this.$store.dispatch("error", "You should sign in to enroll a course.");
                    return;
                }
                let transaction = new Ticket(this.currentUser.id, ticket);
                TicketService.update(transaction).then(
                    data => {
                        //You can get warning, if you don't use paremeters.
                        console.log(data);
                        this.$store.dispatch("success", "Enrollment is completed.");
                    },
                    error => {
                        console.log(error);
                        this.$store.dispatch("error", "Unexpected error occurred.");
                    }
                );
            },
            detail(item) {
                console.log(item);
                localStorage.setItem("detailCourse", JSON.stringify(item));
                this.$router.push({name: "detail", params: {id: item.id}});
            }
        }
    };
</script>

<style scoped>

</style>


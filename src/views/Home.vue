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

<!--        <div class="card-body">-->
<!--          <table class="table table-striped">-->
<!--            <thead>-->
<!--              <tr>-->
<!--                <th scope="col">#</th>-->
<!--                <th scope="col">Name</th>-->
<!--                <th scope="col">UserName</th>-->
<!--                <th scope="col">Detail</th>-->
<!--                <th scope="col">Action</th>-->
<!--              </tr>-->
<!--            </thead>-->
<!--            <tbody>-->
<!--              <tr v-for="(item, index) in users" v-bind:key="item.id">-->
<!--                <th scope="row">{{index}}</th>-->
<!--                <td>{{item.name}}</td>-->
<!--                <td>{{item.username}}</td>-->
<!--                <td>-->
<!--                  <button class="btn btn-info" @click="detail(item)">Detail</button>-->
<!--                </td>-->
<!--                <td>-->
<!--                  <button class="btn btn-success" @click="enroll(item)">Enroll</button>-->
<!--                </td>-->
<!--              </tr>-->
<!--            </tbody>-->
<!--          </table>-->
<!--        </div>-->


      </div>
    </div>
</template>

<script>
/* eslint-disable */
import UserService from "../services/user.service";
import CourseService from "../services/course.service";
import { User } from "../models/user";
import { Transaction } from "../models/transaction";

export default {

  name: "home",
  data() {
    return {
      is:false,
      courses: [],
      users: [],
      currentUser: new User()
    };
  },
  created() {
    UserService.currentUser.subscribe(data => {
      this.currentUser = data;
      if(this.currentUser === null){
        this.$router.push("/login");
      }else
      if(this.currentUser == null){
        this.$router.push("/login");
      }
    });


    // CourseService.findAllCourses().then(data => {
    //   this.courses = data.data;
    // });
    // UserService.findAllUsers().then(data => {
    //   this.users = data.data;
    // });
  },
  methods: {
    enroll(course) {
      if (!this.currentUser) {
        this.$store.dispatch("error", "You should sign in to enroll a course.");
        return;
      }
      let transaction = new Transaction(this.currentUser.id, course);
      CourseService.createTransaction(transaction).then(
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
      this.$router.push({ name: "detail", params: { id: item.id } });
    }
  }
};
</script>
<style scoped>
</style>


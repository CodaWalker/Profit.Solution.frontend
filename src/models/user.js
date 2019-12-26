export class User {
    constructor(username, password, firstName,lastName, middleName,email,typeUser, specialization, creationDate, id) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.typeUser = typeUser;
        this.specialization = specialization;
        this.creationDate = creationDate;
        this.id = id;
    }
}
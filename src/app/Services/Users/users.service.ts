import { User } from "@/Types/user.types";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { get } from "http";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'

})

export class UsersService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAllUsers() {
        return this.http.get<User[]>(`${this.apiUrl}/api/users`);
    }

    getUserById(id: number) {
        return this.http.get<User>(`${this.apiUrl}/api/users/${id}`);
    }

    createUser(user: User) {
        return this.http.post<User>(`${this.apiUrl}/api/users`, user);
    }

    deleteUser(id: number) {
        return this.http.delete(`${this.apiUrl}/api/users/${id}`);
    }

    getTransporters() {
        return this.getAllUsers().pipe(
            map(users => users.filter(user => user.roles.includes('PROVIDER')))
        );
    }
}
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private authUrl = `${environment.apiUrl}/auth`;
    private token: string | null = null;

    constructor() { }
}
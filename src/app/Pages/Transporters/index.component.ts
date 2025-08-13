import { UsersService } from "@/Services/Users/users.service";
import { Component, inject } from "@angular/core";

@Component({
    standalone: true,
    templateUrl: './index.component.html',
    imports: [],
})
export class TransportersIndexComponent {
    usersService = inject(UsersService);
}

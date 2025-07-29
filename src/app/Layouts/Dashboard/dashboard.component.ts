import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../../Components/Sidebar/sidebar.component";


@Component({
    selector: 'layout-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [RouterOutlet, SidebarComponent],
    standalone: true,
})
export class DashboardLayout {

    showFiller = false;
    title = '';
    subtitle = '';
    private router = inject(Router);

    constructor() {
        this.router.events.subscribe(() => {
            const route = this.getDeepestChild(this.router.routerState.root);
            this.title = route.snapshot.data?.['title'] || '';
            this.subtitle = route.snapshot.data?.['subtitle'] || '';
        });
    }

    private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
        return route.firstChild ? this.getDeepestChild(route.firstChild) : route;
    }
}
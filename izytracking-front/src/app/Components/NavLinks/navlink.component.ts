import { NgClass } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'cp-nav-link',
    templateUrl: './navlink.component.html',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgClass],
})

export class NavLinkComponent {
    link = input<string>('');
    label = input<string>('');
    classList = input<string[]>([]);
    get combinedClassList() {
        const baseClasses: { [key: string]: boolean } = {
            'block w-full px-4 py-2 transition rounded': true
        };

        // Add dynamic classes from classList input
        this.classList().forEach(className => {
            baseClasses[className] = true;
        });

        return baseClasses;
    }

    constructor() { }

}
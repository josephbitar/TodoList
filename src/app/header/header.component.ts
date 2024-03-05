import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { CognitoService } from "../auth/cognito.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html"
})
export class HeaderComponent {
    constructor(private cognitoService: CognitoService, private router: Router) {}

    onLogout() {
        this.cognitoService.signOut().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
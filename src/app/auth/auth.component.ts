import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { CognitoService, IUser } from "./cognito.service";

@Component({
    selector: "app-auth",
    templateUrl: "auth.component.html"
})
export class AuthComponent {
    isLoginMode: boolean = true;
    isSingUpConfirmation: boolean = false;

    constructor(private cognitoService:CognitoService, private router:Router) {}

    onSwitchMode = () => {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit = (authForm: NgForm) => {
        const user:IUser = {
            email: authForm.value.email,
            password: authForm.value.password,
            code: authForm.value.code
        }
        if (this.isLoginMode && !this.isSingUpConfirmation) {
            this.cognitoService.signIn(user)
            .pipe(
                map(singInOutput => {
                    if (singInOutput.isSignedIn) {
                        console.log(JSON.stringify(singInOutput));
                    } else {
                        throw new Error("Unauthorized");
                    }
                }),
                catchError((err, caught) => of(err))
            ).subscribe((singInOutput) => {
                if (singInOutput) {
                    this.router.navigate(['/']);
                }
            });
        } else if (this.isSingUpConfirmation) {
            this.cognitoService.confirmSignUp(user)
            .pipe(
                map(val => {
                    return console.log(JSON.stringify(val));
                })
            )
            .subscribe(() => {
                this.isSingUpConfirmation = false;
            });
        } else {
            this.cognitoService.signUp(user)
            .pipe(
                map(val => {
                    return console.log(JSON.stringify(val));
                })
            )
            .subscribe((signUpOutput) => {
                this.isSingUpConfirmation = true;
            });
        } 
    }
}
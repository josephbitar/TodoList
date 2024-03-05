import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CognitoService } from './auth/cognito.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {
    constructor(private authService: CognitoService, private router: Router) {}
    canActivate(next:ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean|UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.isAuthenticated().pipe(
            map(isAuthenticated => {
                if (isAuthenticated) {
                    return true;
                } else {
                    return this.router.createUrlTree(['/login']);
                }
            })
        )
    }
}
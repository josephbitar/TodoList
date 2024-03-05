import { Injectable } from "@angular/core";
import { AuthSession } from "@aws-amplify/core/dist/esm/singleton/Auth/types";
import  { Amplify}  from "aws-amplify";
import  { signIn, signOut, signUp, confirmSignUp, getCurrentUser, SignInOutput, fetchAuthSession, JWT, AuthUser}  from "aws-amplify/auth";
import { from, Observable, of, Subject } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { envs } from "../environments.props";

export interface IUser {
    email: string,
    password: string,
    showPassword?: boolean,
    code?: string,
    name?: string
}

@Injectable({
    providedIn: 'root'
})
export class CognitoService {
    public user = new Subject<IUser>();
    constructor() {
        Amplify.configure({
            Auth: {
              Cognito: {
                userPoolClientId: envs.dev.userPoolClientId,
                userPoolId: envs.dev.userPoolId,
              }
            }
          });
    }

    public signUp(user: IUser): Observable<any> {
        return from(signUp({ username: user.email, password: user.password}));
    }

    public signIn(user:IUser): Observable<SignInOutput> {
        return from(signIn({username: user.email, password: user.password}));
    }

    public confirmSignUp(user:IUser): Observable<any> {
        return from(confirmSignUp({username: user.email, confirmationCode: user.code}));
    }
    
    public signOut(): Observable<any> {
        return from(signOut());
    }

    public isAuthenticated(): Observable<boolean> {
        return from(getCurrentUser())
          .pipe(
            // Map the result to a boolean indicating whether the user is authenticated
            map(user => {
                return !!user;
            }),
            catchError(() => of(false))
          )as Observable<boolean>;
    }

    public getAccessToken(): Observable<AuthSession> {
        return from(fetchAuthSession()).pipe(
            map(authSession => {
                if (authSession) {
                    return authSession;
                }
            }),
            catchError((err, caught) => of(err))
        );
    }

    public getCurrentUser(): Observable<AuthUser> {
        return from(getCurrentUser())
          .pipe(
            map(user => {
                return user;
            }),
            catchError(() => of(false))
          )as Observable<AuthUser>;
    }
}
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { envs } from "../environments.props";

@Injectable({
    providedIn: 'root'
})
export class EventListService {
    constructor(public http: HttpClient) {}

    public getEventList(accessToken: string, userId: string): Observable<any> {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        });
        return this.http.get(envs.dev.postTodList.url +`?userId=${userId}`, {headers: headers})
    }

    public removeTodoItem(accessToken: string, userId: string, id: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          });
          return this.http.delete(envs.dev.deleteTodList.url +`/${id}?userId=${userId}`, {headers: headers});
    }
} 
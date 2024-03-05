import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable, of, Subscription } from "rxjs";
import { envs } from "../environments.props";
import { S3Handler } from "../handlers/s3-handler.component";

@Injectable({
    providedIn: 'root'
})
export class EventItemService implements OnDestroy {
    private uploadToS3Subscription: Subscription;
    constructor(private s3Handler: S3Handler, private http: HttpClient) { }

    ngOnDestroy(): void {
        this.uploadToS3Subscription.unsubscribe();
    }

    /**
     * Uploads attachements into S3 buckets...
     * @param files 
     * @param accessToken 
     * @returns 
     */
    public uploadToS3(files: File[], accessToken: string): Observable<any> {
        if (files.length > 0) {
            return this.s3Handler.uploadFiletoS3(files, accessToken);
        } else {
            return of([]);
        }
    }

    /**
     * Sends Http request to AWS API gateway to create a new todo item
     * @param accessToken 
     * @param newEventForm 
     * @returns 
     */
    public createNewEventPost(accessToken: string, newEventForm: NgForm): Observable<any> {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        });
        return this.http.post(envs.dev.postTodList.url, JSON.stringify(newEventForm.value), {headers: headers})
    }
}
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { CognitoIdentityCredentials } from 'aws-sdk';
import { env } from 'process';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CognitoService } from '../auth/cognito.service';
import { envs } from '../environments.props';

@Injectable({
    providedIn: 'root'
})
export class S3Handler {
    constructor(private cognitoService: CognitoService) { }

    private getCognitoCredentials(accessToken: string): Observable<CognitoIdentityCredentials> {
        const tempCredentials = new CognitoIdentityCredentials({
            IdentityPoolId: envs.dev.identityPoolId,
            RoleArn: '...',
            Logins: {
                [envs.dev.loginsKey]: accessToken,
            }
        });
        return of(tempCredentials);
    }

    public uploadFiletoS3(files: File[], accessToken: string): Observable<any> {
        const uploadObservables: Observable<AWS.S3.ManagedUpload.SendData>[] = [];
        return this.getCognitoCredentials(accessToken).pipe(
            switchMap((tempCredentials) => {
                AWS.config.credentials = tempCredentials;
                const s3 = new AWS.S3();
                files.forEach(file => {
                    const params = {
                        Bucket: envs.dev.s3BucketName,
                        Key: `uploads/${file.name}`,
                        Body: file
                    };
                    const uploadObservable = new Observable<AWS.S3.ManagedUpload.SendData>((observer) => {
                        s3.upload(params, (err, data) => {
                            if (err)
                                observer.error(err)
                            else {
                                observer.next(data);
                                observer.complete();
                            }
                        })
                    })
                    uploadObservables.push(uploadObservable)
                })
                return forkJoin(uploadObservables);
            }),
            catchError((err, caught) => {
                console.log(err);
                return caught;
            })
        );
    }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { mergeMap, catchError, zipAll } from 'rxjs/operators';
import { CognitoService } from '../auth/cognito.service';
import { forkJoin, throwError, zip } from 'rxjs';
import { FormGroup, NgForm } from '@angular/forms';
import { EventItemService } from './event-item.service';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss',
})
export class EventItemComponent implements OnInit {
  parentForm: FormGroup;
  selectedFiles: File[] = [];
  attachName: string = "attach";
  eventDateName: string = "eventDate";

  constructor(private cognitoService: CognitoService,
    private eventItemService: EventItemService,
    private router: Router) {
  }

  ngOnInit() {
  }

  handleFilesSelected(files: File[]): void {
    this.selectedFiles = files;
  }

  onSubmit = (newEventForm: NgForm) => {
    let jwt = "";
    let userId = "";
    forkJoin([this.cognitoService.getAccessToken(), this.cognitoService.getCurrentUser()]) // Get JWT token and userId
      .pipe(
        mergeMap((results) => {
          jwt = results[0].tokens.accessToken.toString();
          userId = results[1].userId;
          return this.eventItemService.uploadToS3(this.selectedFiles, jwt) // Upload to S3
        }),
        mergeMap(result => {
          let files = [];
          if (result && result.length > 0) {
            result = result as any[];
            result.forEach(file => files.push({ key: file.Key, location: file.Location, bucket: file.Bucket }));
          }
          newEventForm.value.userId = userId;
          newEventForm.value.attach = files;
          return this.eventItemService.createNewEventPost(jwt, newEventForm) // Create a new todo list item in DynamoDB
        }),
        catchError((error) => {
          console.error('API Request error:', error);
          return throwError('Failed to make post API request');
        })
      ).subscribe(nextVal => {
        console.log("creating a new event is in progress...");
      },
        error => {
          console.error('Error:', error);
        },
        () => {
          console.log("Completed creating new event sucessfully...")
          this.router.navigate(['/allEvents']);
        }
      )
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subscription, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { CognitoService } from '../auth/cognito.service';
import { EventListService } from './event-list.service';
import { Event } from './event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  private eventListSubscription: Subscription;

  constructor(private cognitoService: CognitoService, private eventListService: EventListService, private router: Router) { }

  ngOnInit(): void {
    let userId = "";
    let jwt = "";
    this.eventListSubscription = forkJoin([this.cognitoService.getAccessToken(), this.cognitoService.getCurrentUser()]) // Get JWT token and userId
      .pipe(
        mergeMap(results => {
          jwt = results[0].tokens.accessToken.toString();
          userId = results[1].userId;
          return this.eventListService.getEventList(jwt, userId);
        })
        , catchError((error) => {
          console.error('API Request error:', error);
          return throwError('Failed to make get API request');
        })
      ).subscribe(nextVal => {
        console.log("Fetching list is in progress...");
        this.events = nextVal;
      },
        error => {
          console.error('Error:', error);
        },
        () => {
          console.log("Completed fetching list sucessfully...")
        }
      );
  }

  deleteTodo(id: string): void {
    let userId = "";
    let jwt = "";
    this.eventListSubscription = forkJoin([this.cognitoService.getAccessToken(), this.cognitoService.getCurrentUser()]) // Get JWT token and userId
      .pipe(
        mergeMap(results => {
          jwt = results[0].tokens.accessToken.toString();
          userId = results[1].userId;
          return this.eventListService.removeTodoItem(jwt, userId, id);
        })
        , catchError((error) => {
          console.error('API Request error:', error);
          return throwError('Failed to make delete API request');
        })
      ).subscribe(nextVal => {
        console.log("Deleting an item...");
      },
        error => {
          console.error('Error:', error);
        },
        () => {
          console.log("Completed deleting item sucessfully...");
          this.router.navigate(['allEvents']);
        }
      );
  }

  markAsDone(todoCreate: Date): void {
    const todoIndex = this.events.findIndex((todo) => todo.create === todoCreate);
    if (todoIndex !== -1) {
      this.events[todoIndex].done = true;
    }
  }

  ngOnDestroy(): void {
    this.eventListSubscription.unsubscribe();
  }
}

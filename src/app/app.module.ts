import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { EventDetailsComponent } from './event-details/event-details.component';
import { EventItemComponent } from './event-item/event-item.component';
import { EventListComponent } from './event-list/event-list.component';
import { HeaderComponent } from './header/header.component';
import { DatepickerComponent } from './shared/datepicker/datepicker.component';
import { FileUploadComponent } from './shared/file-upload/file-upload.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGaurd } from './app.auth.gaurd';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  {path: 'login', component: AuthComponent},
  {path: '', component: EventListComponent, canActivate: [AuthGaurd]},
  {path: 'allEvents', component: EventListComponent, canActivate: [AuthGaurd]},
  // {path: 'allEvents/:id', component: EventDetailsComponent, canActivate: [AuthGaurd]},
  {path: 'newEvent', component: EventItemComponent, canActivate: [AuthGaurd]},
  {path: 'auth', component: AuthComponent, canActivate: [AuthGaurd]}
]
@NgModule({
  declarations: [ // Register compnents
    AppComponent,
    HeaderComponent,
    EventItemComponent,
    EventListComponent,
    // EventDetailsComponent,
    DatepickerComponent,
    FileUploadComponent,
    AuthComponent
    
  ],
  imports: [ // Import other modules
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent] // Includes the root component
})
export class AppModule { } // Used to bundle pieces of compnents

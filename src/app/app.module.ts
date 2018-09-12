
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { LiveComponent } from './live/live.component';
import { StatsComponent } from './stats/stats.component';
import { RepsComponent } from './reps/reps.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MessagesComponent } from './messages/messages.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app.module.html',
  styleUrls: ['app.module.css']
})
export class App {
}

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'account/:id', component: AccountComponent },
  { path: 'live', component: LiveComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'reps', component: RepsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgbModule.forRoot(), RouterModule.forRoot(
    appRoutes//,{ enableTracing: true } // <-- debugging purposes only
  )],
  declarations: [App, NavbarComponent, AccountComponent, HomeComponent, LiveComponent, StatsComponent, RepsComponent, PageNotFoundComponent, MessagesComponent, FooterComponent],
  bootstrap: [App]
})
export class AppModule { }

import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { navbar } from './navbar-component/navbar';
import { AccountComponentComponent } from './account-component/account-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { LiveComponentComponent } from './live-component/live-component.component';
import { StatsComponentComponent } from './stats-component/stats-component.component';
import { RepsComponentComponent } from './reps-component/reps-component.component';
import { AccountingComponentComponent } from './accounting-component/accounting-component.component';
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
  { path: 'home', component: HomeComponentComponent },
  { path: 'account/:id', component: AccountComponentComponent },
  { path: 'live', component: LiveComponentComponent },
  { path: 'stats', component: StatsComponentComponent },
  { path: 'reps', component: RepsComponentComponent },
  { path: 'accounting', component: AccountingComponentComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgbModule.forRoot(), RouterModule.forRoot(
    appRoutes//,{ enableTracing: true } // <-- debugging purposes only
  )],
  declarations: [App, navbar, AccountComponentComponent, HomeComponentComponent, LiveComponentComponent, StatsComponentComponent, RepsComponentComponent, AccountingComponentComponent, PageNotFoundComponent, MessagesComponent, FooterComponent],
  bootstrap: [App]
})
export class AppModule { }
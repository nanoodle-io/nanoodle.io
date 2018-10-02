
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
import { BusinessComponent } from './business/business.component';
import { RepsComponent } from './reps/reps.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MessagesComponent } from './messages/messages.component';
import { FooterComponent } from './footer/footer.component';
import { SocialComponent } from './social/social.component';
import { BlockComponent } from './block/block.component';
import { QRCodeModule } from 'angularx-qrcode';
import { BlockTimeComponent } from './blockTime/blockTime.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountDownloadComponent  } from './accountDownload/accountDownload.component';
import { AccountDownloadComponentDialog  } from './accountDownload/accountDownload.component';
import { MatDialogModule } from '@angular/material/dialog';

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
  { path: 'hash/:id', component: AccountComponent },
  { path: 'block/:id', component: BlockComponent },
  { path: 'live', component: LiveComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'reps', component: RepsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [BrowserModule, MatDialogModule, FormsModule, BrowserAnimationsModule, MatButtonModule, MatSelectModule, QRCodeModule, ReactiveFormsModule, HttpClientModule, NgbModule.forRoot(), RouterModule.forRoot(
    appRoutes//,{ enableTracing: true } // <-- debugging purposes only
  )],
  declarations: [App, NavbarComponent, AccountDownloadComponent, AccountDownloadComponentDialog, AccountComponent, BlockTimeComponent, HomeComponent, LiveComponent, BusinessComponent, RepsComponent, PageNotFoundComponent, MessagesComponent, FooterComponent, SocialComponent, BlockComponent],
  entryComponents: [ AccountDownloadComponentDialog ],
  bootstrap: [App]
})
export class AppModule { }
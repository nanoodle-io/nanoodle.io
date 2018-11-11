
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
import { ProductComponent } from './products/products.component';
import { RepsComponent } from './reps/reps.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MessagesComponent } from './messages/messages.component';
import { FooterComponent } from './footer/footer.component';
import { SocialComponent } from './social/social.component';
import { BlockComponent } from './block/block.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountDownloadComponent  } from './accountDownload/accountDownload.component';
import { TransactionRowComponent  } from './transactionRow/transactionRow.component';
import { AccountDownloadComponentDialog  } from './accountDownload/accountDownload.component';
import { AccountWatchComponent, AccountWatchComponentDialog  } from './accountWatch/accountWatch.component';
import { MatDialogModule } from '@angular/material';
import { DonateComponent, DonateComponentDialog } from './donate/donate.component';
import { UnsubscribeComponent  } from './unsubscribe/unsubscribe.component';
import { VerifyComponent } from './verify/verify.component';
import { TransactionGraphComponent } from './transactionGraph/transactionGraph.component';

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
  { path: 'products', component: ProductComponent },
  { path: 'reps', component: RepsComponent },
  { path: 'verify/:id', component: VerifyComponent },
  { path: 'unsubscribe/:id', component: UnsubscribeComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [BrowserModule, MatDialogModule, FormsModule, BrowserAnimationsModule, MatButtonModule, MatSelectModule, MatInputModule, QRCodeModule, ReactiveFormsModule, HttpClientModule, NgbModule.forRoot(), RouterModule.forRoot(
    appRoutes//,{ enableTracing: true } // <-- debugging purposes only
  )],
  declarations: [App, NavbarComponent, TransactionRowComponent, TransactionGraphComponent, UnsubscribeComponent, VerifyComponent, AccountWatchComponent, AccountWatchComponentDialog, AccountDownloadComponent,AccountDownloadComponentDialog, DonateComponent, DonateComponentDialog, AccountComponent, HomeComponent, LiveComponent, ProductComponent, RepsComponent, PageNotFoundComponent, MessagesComponent, FooterComponent, SocialComponent, BlockComponent],
  entryComponents: [ AccountDownloadComponentDialog, DonateComponentDialog, AccountWatchComponentDialog ],
  bootstrap: [App]
})
export class AppModule { }
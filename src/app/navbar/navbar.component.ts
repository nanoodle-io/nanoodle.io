import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonateComponent } from '../donate/donate.component'
import { MyNanoNinjaService } from '../mynanoninja.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  title = 'app';
  isNavbarCollapsed = true;
  searchTerm: string;
  alias: Object;
  temp: Object;

  //in your constructor
  constructor(public router: Router, public donate: DonateComponent, private myNanoNinjaService: MyNanoNinjaService) {
  }

  ngOnInit(): void {
    this.temp = new Object();
    this.alias = null;
    this.getAliases();
  }

  checkLocalStorage(): boolean {
    if (localStorage.hasOwnProperty('account') && localStorage['account'])
    {
      return true;
    }
    return false;
  }

  getSavedAccount(): string {
    return localStorage.getItem('account');
  }

  search(param: string) {
    this.searchTerm = null;
    let address = new RegExp('^(xrb_|nano_|XRB_|NANO_)[a-zA-Z0-9]{60}$');
    let hash = new RegExp('^[a-zA-Z0-9]{64}$');
    if (address.test(param)) {
      this.router.navigate(['/account', param.toLowerCase()]);
    }
    else if (hash.test(param)) {
      this.router.navigate(['/block', param.toUpperCase()]);
    }
    else {
      if (this.alias != null && param.toUpperCase() in this.alias) {
        this.router.navigate(['/account', this.alias[param.toUpperCase()].toLowerCase()]);
      }
    }
  }

  getAliases(): void {
    try {
      this.myNanoNinjaService.getAliases()
        .subscribe(data => {
          if (data != null) {
            for (var i = 0; i < data.length; i++) {
              this.temp[data[i]['alias'].toUpperCase()] = data[i]['account'];
            }
          }
          this.alias = this.temp;
        });
    } catch (error) {
    }
  }

  scroll(el) {
    el.scrollIntoView();
  }

  openDonate() {
    this.donate.openDonateDialog();
  }
}
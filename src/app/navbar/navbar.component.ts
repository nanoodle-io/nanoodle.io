import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  title = 'app';
  isNavbarCollapsed = true;
  searchTerm: string;

  //in your constructor
  constructor(public router: Router) { }

  search(param: string) {
    this.searchTerm = null;
    var reg = new RegExp('^(xrb_|nano_|XRB_|NANO_)[a-zA-Z0-9]{60}$');
    if (reg.test(param)) {
      this.router.navigate(['/account', param.toLowerCase()]);
    }
    reg = new RegExp('^[a-zA-Z0-9]{64}$');
    if (reg.test(param)) {
      this.router.navigate(['/block', param]);
    }
  }

  scroll(el) {
    el.scrollIntoView();
  }
}
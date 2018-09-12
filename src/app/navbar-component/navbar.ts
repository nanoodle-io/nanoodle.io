import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['navbar.css']
})

export class navbar {
  isNavbarCollapsed = true;

  myFunction() {
    console.log("test");
  }
}
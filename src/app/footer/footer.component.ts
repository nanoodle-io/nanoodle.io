import { Component, OnInit } from '@angular/core';
import { TACComponent } from '../tac/tac.component'
import { PrivacyComponent } from '../privacy/privacy.component'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public tac: TACComponent, public privacy: PrivacyComponent) { }

  ngOnInit() {
  }

  openTAC() {
    this.tac.openTACDialog();
  }

  openPrivacy() {
    this.privacy.openPrivacyDialog();
  }
}

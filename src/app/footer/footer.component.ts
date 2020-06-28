import { Component, OnInit } from '@angular/core';
import { TACComponent } from '../tac/tac.component'
import { PrivacyComponent } from '../privacy/privacy.component'
import { NodeService } from '../node.service';
import { MessageService } from '../message.service';
import { NanoodleService } from '../nanoodle.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  blockCountResults: BlockCountResults;
  networkMedianResults: number;
  networkMaxResults: number;
  lastPriceTime: string;
  reg = new RegExp('"error"');

  constructor(public tac: TACComponent, private messageService: MessageService, public privacy: PrivacyComponent, private nodeService: NodeService, private nanoodleService: NanoodleService) { }

  openTAC() {
    this.tac.openTACDialog();
  }

  openPrivacy() {
    this.privacy.openPrivacyDialog();
  }

  openServiceMessages() {
    this.lastPriceTime = null;
    this.blockCountResults = null;
    this.networkMedianResults = null;
    this.networkMaxResults = null;
    this.getBlockCount();
  }

  formatDecimals(input: number): string {
    const dec = 2;
    return input.toFixed(dec);
  }

  //date helper functions
  pad2(n) { return n < 10 ? '0' + n : n }

  getBlockCount(): void {
    this.nodeService.getBlockCount()
      .subscribe(data => {
        this.blockCountResults = data;
        this.nanoodleService.getNetworkStats(new Date())
          .subscribe(data => {
            this.networkMedianResults = +data['Items'][data['Count']-1]['networkData']['blockCountMedian'];
            this.networkMaxResults = +data['Items'][data['Count']-1]['networkData']['blockCountMax'];
            this.messageService.add('The NANOODLE node is at ' + this.blockCountResults['count'] + ' (compared to a max of ' + this.networkMaxResults + ' and a median of ' + this.networkMedianResults + ' in the Nano network, sourced from NanoTicker).');
          });
      });
  }
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}
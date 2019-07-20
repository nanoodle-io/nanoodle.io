import { Component, OnInit } from '@angular/core';
import { TACComponent } from '../tac/tac.component'
import { PrivacyComponent } from '../privacy/privacy.component'
import { MarketService } from '../market.service';
import { NodeService } from '../node.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  blockCountResults: BlockCountResults;
  lastPriceTime: string;
  reg = new RegExp('"error"');

  constructor(public tac: TACComponent, private messageService: MessageService, public privacy: PrivacyComponent, private nodeService: NodeService, private marketService: MarketService) { }

  openTAC() {
    this.tac.openTACDialog();
  }

  openPrivacy() {
    this.privacy.openPrivacyDialog();
  }

  openServiceMessages() {
    this.lastPriceTime = null;
    this.blockCountResults = null;
    this.getLastPrice();
    this.getBlockCount();
  }

  getLastPrice(): void {
    this.marketService.getLastMarketPrice()
      .subscribe(data => {
        let tempDate = new Date(data[0]['log']['epochTimeStamp']['$date']);
        this.lastPriceTime = this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + "-" + this.pad2(tempDate.getFullYear()) + " " + this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes());
        this.messageService.add('The last receipt of price data from CryptoCompare was at ' + this.lastPriceTime);
      });
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
        if (this.reg.test(JSON.stringify(this.blockCountResults))) {
          this.messageService.add(JSON.stringify(this.blockCountResults['error']));
        }
        else {
          this.messageService.add('The NANOODLE node is ' + this.formatDecimals(+(+this.blockCountResults['count'] / (+this.blockCountResults['count'] + +this.blockCountResults['unchecked'])) * 100) + '% in sync with the Nano network');
        }
      });
  }
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}
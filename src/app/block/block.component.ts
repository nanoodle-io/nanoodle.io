import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { NanoodleService } from '../nanoodle.service';
import { NodeService } from '../node.service';

@Component({
  selector: "app-block",
  templateUrl: "./block.component.html",
  styleUrls: ['./block.component.css']
})

export class BlockComponent implements OnInit {
  paramsub: any;
  utcOffset: string;
  error: string;

  //Results
  key: string;
  blockTime: BlockTime;
  blockResults: BlockResults;
  detail: Detail;
  contents: Content;

  linkKey: string;
  linkBlockTime: BlockTime;
  linkBlockResults: BlockResults;
  linkDetail: Detail;
  linkContents: Content;

  constructor(private messageService: MessageService, private NodeService: NodeService, private route: ActivatedRoute, private nanoodleService: NanoodleService) { }

  ngOnInit(): void {
    this.key = null;
    this.detail = null;
    this.contents = null;
    this.blockResults = null;
    this.blockTime = null;
    this.error = null;
    this.linkKey = null;
    this.linkDetail = null;
    this.linkContents = null;
    this.linkBlockResults = null;
    this.linkBlockTime = null;

    this.paramsub = this.route.params.subscribe(sub => {
      this.getBlock(sub['id']);
      this.getBlockTime(sub['id']);
    });
    let tz = Math.floor(new Date().getTimezoneOffset() / -60);
    if (tz > -1) {
      this.utcOffset = "+" + tz;
    }
    else {
      this.utcOffset = "" + tz;
    }
  }

  getBlockTime(blockParam: string): void {
    this.nanoodleService.getBlockTime(blockParam)
      .subscribe(data => {
        this.blockTime = data;
      });
  }

  getLinkBlockTime(blockParam: string): void {
    this.nanoodleService.getBlockTime(blockParam)
      .subscribe(data => {
        this.linkBlockTime = data;
      });
  }

  formatDate(rawDate: string, offset: number): string {
    let myDate = new Date(new Date(rawDate).getTime() + (offset * 3600000));
    return myDate.toLocaleString('en-GB', { timeZone: 'UTC' });
  }

  getBlock(blockParam: string): void {
    this.NodeService.getBlock(blockParam)
      .subscribe(data => {
        this.blockResults = JSON.parse(this.formatContents(JSON.stringify(data)));
        this.key = JSON.stringify(Object.keys(this.blockResults['blocks'])[0]).replace(/\"/g, '');
        this.detail = this.blockResults['blocks'][this.key];
        this.contents = this.detail['contents'];
        if (this.detail['subtype'] == 'receive') {
          this.getLinkBlockTime(this.contents['link']);
          this.NodeService.getBlock(this.contents['link'])
            .subscribe(data => {
              this.getLinkBlockTime(this.contents['link']);
              this.linkBlockResults = JSON.parse(this.formatContents(JSON.stringify(data)));
              this.linkKey = JSON.stringify(Object.keys(this.linkBlockResults['blocks'])[0]).replace(/\"/g, '');
              this.linkDetail = this.linkBlockResults['blocks'][this.linkKey];
              this.linkContents = this.linkDetail['contents'];
            });
        }
      });
  }

  formatDecimals(input: number): string {
    const dec = 3;
    return input.toFixed(dec);
  }

  formatAmount(type: string, amount: number, returnSymbol: boolean): string {
    if (type == 'XRB') {
      let raw = 1000000000000000000000000000000;
      let temp = amount / raw;
      if (returnSymbol) {
        return temp.toFixed(2);
      }
      else {
        return temp.toFixed(2);

      }
    }
    else if (type == 'XNO') {
      let raw = 1000000000000000000000000000;
      let temp = amount / raw;
      if (returnSymbol) {
        return '₦' + temp.toFixed(0);
      }
      else {
        return temp.toFixed(0);
      }
    }
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  private log(message: string) {
    this.messageService.add(`Block Component: ${message}`);
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }
}

interface BlockResults {
  error?: string;
  blocks?: Block[];
}

interface Block {
  [detail: string]: Detail;
}

interface Detail {
  block_account: string;
  amount: string;
  contents: Content;
}

interface Content {
  type: string;
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account: string;
  signature: string;
  work: string;
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}

interface BlockTime {
  Items: Time[];
}

interface Time {
  blockTimeStamp: string;
}
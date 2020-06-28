import { Component, OnInit, Input } from '@angular/core';
import { NodeService } from '../node.service';
import { MessageService } from '../message.service';
import { NanoodleService } from '../nanoodle.service';

@Component({
  selector: '[app-transactionRow]',
  templateUrl: "./transactionRow.component.html",
  styleUrls: ['./transactionRow.component.css']
})

export class TransactionRowComponent implements OnInit {
  //Results
  blockTime: BlockTime;
  blockDetails: BlockResults;
  pastRate: number;
  timeFetch: boolean;
  pastRateFetch: boolean;
  tempRate: FiatResults;

  @Input()
  utcOffset: string;

  @Input()
  index: number;

  @Input()
  transactions: Transaction[];

  @Input()
  rate: number;

  @Input()
  alias: Object;

  //detect changes on currency type
  _currencyType: string;
  @Input() set currencyType(value: string) {
    this._currencyType = value;
    this.pastRate = null;
    if (this.blockTime) {
      if (this.blockTime['Count'] > 0) {
        this.pastRateFetch = true;
      }
      else {
        this.pastRateFetch = false;
      }
    }
    this.getMarketRate();
  }

  get currencyType(): string {
    return this._currencyType;
  }

  constructor(private messageService: MessageService, private nodeService: NodeService, private nanoodleService: NanoodleService) { }

  ngOnInit(): void {
    this.blockTime = null;
    this.pastRate = null;
    this.pastRateFetch = true;
    this.timeFetch = true;
    this.blockDetails = null;
    this.getBlockDetails(this.transactions[this.index]['hash']);
  }

  getBlockDetails(blockParam: string): void {
    if (this.transactions[this.index]['type'] == "receive") {
      this.nodeService.getBlock(blockParam)
        .subscribe(data => {
          this.blockDetails = data;
          let blockContent = JSON.parse(this.blockDetails['blocks'][Object.keys(this.blockDetails['blocks'])[0]]['contents']);
          this.nanoodleService.getBlockTime(blockContent['link'])
            .subscribe(data => {
              this.blockTime = data;
              if (this.blockTime['Count'] > 0) {
                this.transactions[this.index]['timestamp'] = new Date(this.blockTime['Items'][0]['blockTimestamp']).getTime();
                this.getMarketRate();
                this.sortTransactions();
              }
              else {
                this.pastRateFetch = false;
              }
              this.timeFetch = false;
            });
        });
    }
    else {
      this.nanoodleService.getBlockTime(blockParam)
        .subscribe(data => {
          this.blockTime = data;
          if (this.blockTime['Count'] > 0) {
            this.transactions[this.index]['timestamp'] = new Date(this.blockTime['Items'][0]['blockTimestamp']).getTime();
            this.getMarketRate();
            this.sortTransactions();
          }
          else {
            this.pastRateFetch = false;
          }
          this.timeFetch = false;
        });
    }
  }

  sortTransactions() {
    this.transactions.sort(this.predicateBy("timestamp"));
  }

  predicateBy(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      }
      return 0;
    }
  }

  getMarketRate() {
    this.nanoodleService.getPrice(new Date(this.transactions[this.index]['timestamp']))
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate[this.currencyType];
          }
          this.pastRate = returnRate / results.length;
        }
        this.pastRateFetch = false;
      });
  }

  displayAccountAddress(account: string): string {
    if (account in this.alias) {
      return this.alias[account];
    }
    else {
      return account;
    }
  }

  formatType(type: string, cellID: string): void {
    if (type == "send") {
      if (document.readyState != "loading") {
        document.getElementById(cellID).classList.add('negative');
      }
    }
    else {
      if (document.readyState != "loading") {
        document.getElementById(cellID).classList.add('positive');
      }
    }
  }

  addType(): string {
    if (this.transactions[this.index]['type'] == "send") {
      return '-'
    }
    else {
      return '+'

    }
  }

  addNotation(): string {
    if (this.transactions[this.index]['type'] == "unprocessed") {
      return '*'
    }
    else {
      return ''
    }
  }

  formatDate(rawDate: string, offset: number): string {
    let myDate = new Date(new Date(rawDate).getTime() + (offset * 3600000));
    return myDate.toLocaleString('en-GB', { timeZone: 'UTC' });
  }

  private log(message: string) {
    this.messageService.add(`Block Component: ${message}`);
  }
}

interface Transaction {
  timestamp: number;
  hash: string;
  type: string;
  account: string;
  amount: number;
}

interface BlockTime {
  Items: Time[];
}

interface Time {
  blockTimeStamp: string;
}

interface FiatResults {
  [currencyType: string]: number;
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

interface BlockResults {
  error?: string;
  blocks?: Block[];
}
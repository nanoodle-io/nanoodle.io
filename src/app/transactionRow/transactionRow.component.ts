import { Component, OnInit, Input } from '@angular/core';
import { BlockService } from '../block.service';
import { MarketService } from '../market.service';
import { MessageService } from '../message.service';

@Component({
  selector: '[app-transactionRow]',
  templateUrl: "./transactionRow.component.html",
  styleUrls: ['./transactionRow.component.css']
})

export class TransactionRowComponent implements OnInit {
  //Results
  blockTime: BlockTime[] = [];
  pastPrice: number;
  pastPriceFetch: boolean;
  tempPrice: FiatResults;

  error: string;
  reg = new RegExp('"error"');

  @Input()
  hash: string;

  @Input()
  utcOffset: string;

  @Input()
  account: string;

  @Input()
  amount: number;

  @Input()
  type: string;

  @Input()
  rate: FiatResults;

  //detect changes on currency type
  _currencyType: string;
  @Input() set currencyType(value: string) {
    this._currencyType = value;
    this.getMarketPrice();
  }

  get currencyType(): string {
    return this._currencyType;
  }

  constructor(private messageService: MessageService, private blockService: BlockService, private marketService: MarketService) { }

  ngOnInit(): void {
    this.blockTime = [];
    this.pastPrice = null;
    this.pastPriceFetch = false;
    this.getBlockDetails(this.hash, this.currencyType);
  }

  getBlockDetails(blockParam: string, currencyType: string): void {
    this.blockService.getBlockTime(blockParam)
      .subscribe(data => {
        this.blockTime = data;
        console.log(this.blockTime);
        this.getMarketPrice();
      });
  }

  getMarketPrice() {
    if (this.blockTime.length > 0) {
      if (this.blockTime[0]['log'].hasOwnProperty('epochTimeStamp')) {
        this.pastPriceFetch = true;
        let timestamp = +this.blockTime[0]['log']['epochTimeStamp'].$date;
        this.marketService.getMarketPrice(timestamp,this.currencyType)
          .subscribe(data => {
            let returnPrice = 0;
            if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                this.tempPrice = data[i];
                returnPrice = returnPrice + this.tempPrice[this.currencyType];
              }
              this.pastPrice = returnPrice / data.length * +this.formatAmount(this.amount, 5);
            }
            else {
              this.pastPriceFetch = false;
            }
          });

      }
    }
  }

  formatType(type: string, cellID: string): void {
    if (type == "receive") {
      if (document.readyState != "loading") {
        document.getElementById(cellID).classList.add('positive');
      }
    }
    else {
      if (document.readyState != "loading") {
        document.getElementById(cellID).classList.add('negative');
      }
    }
  }

  addType(): string {
    if (this.type == "receive") {
      return '+'
    }
    else {
      return '-'
    }
  }

  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
  }

  formatAmount(mRai: number, places: number): string {
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
    return temp.toFixed(places);
  }

  formatDate(rawDate: number): string {
    let myDate = new Date(rawDate);
    return myDate.toLocaleString();
  }

  private log(message: string) {
    this.messageService.add(`Block Component: ${message}`);
  }
}

interface BlockTime {
  _id?: string;
  log: Time;
}

interface Time {
  epochTimeStamp: DateTime;
}

interface DateTime {
  $date: DateTime;
}

interface FiatResults {
  [currencyType: string]: number;
}
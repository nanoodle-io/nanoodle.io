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
  blockTime: BlockTime[];
  pastPrice: number;
  pastPriceFetch: boolean;
  tempPrice: FiatResults;

  error: string;
  reg = new RegExp('"error"');

  @Input()
  hash: string;

  @Input()
  account: string;

  @Input()
  amount: number;

  @Input()
  type: string;

  @Input()
  rate: FiatResults;

  constructor(private messageService: MessageService, private blockService: BlockService, private marketService: MarketService) { }

  ngOnInit(): void {
    this.blockTime = null;
    this.pastPrice = null;
    this.pastPriceFetch = false;
    this.getBlockTime(this.hash);
  }

  getBlockTime(blockParam: string): void {
    this.blockService.getBlockTime(blockParam)
      .subscribe(data => {
        this.blockTime = data;
        if (this.blockTime.length > 0) {
          if (this.blockTime[0]['log'].hasOwnProperty('epochTimeStamp')) {
            this.pastPriceFetch = true;
            this.getMarketPrice(+this.blockTime[0]['log']['epochTimeStamp'].$date);
          }
        }
      });
  }

  getMarketPrice(timestamp: number) {
    this.marketService.getMarketPrice(timestamp)
      .subscribe(data => {
        let returnPrice = 0;
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempPrice = data[i];
            returnPrice = returnPrice + this.tempPrice.NANO.GBP;
          }
          this.pastPrice = returnPrice / data.length * +this.formatAmount(this.amount,5);
        }
        else{
          this.pastPriceFetch = false;
        }
      });
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

  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
  }

  formatAmount(mRai: number, places: number): string {
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
    return temp.toFixed(places);
  }

  formatDate(rawDate: string): string {
    return rawDate.match(/\d{2}\/[A-Za-z]{3}\/\d{4}/) + " " + ("" + rawDate.match(/\d{2}:\d{2}:\d{2} /)).trim();
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
  dateTime: string;
  epochTimeStamp: DateTime;
}

interface DateTime {
  $date: DateTime;
}


interface FiatResults {
  NANO: FiatRate;
}

interface FiatRate {
  USD: number;
  EUR: number;
  GBP: number;
}
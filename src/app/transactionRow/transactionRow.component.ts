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
  pastRate: number;
  pastRateFetch: boolean;
  tempRate: FiatResults;

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
    this.getMarketRate();
  }

  get currencyType(): string {
    return this._currencyType;
  }

  constructor(private messageService: MessageService, private blockService: BlockService, private marketService: MarketService) { }

  ngOnInit(): void {
    this.blockTime = [];
    this.pastRate = null;
    this.pastRateFetch = false;
    this.getBlockDetails(this.hash, this.currencyType);
  }

  getBlockDetails(blockParam: string, currencyType: string): void {
    this.blockService.getBlockTime(blockParam)
      .subscribe(data => {
        this.blockTime = data;
        this.getMarketRate();
      });
  }

  getMarketRate() {
    if (this.blockTime.length > 0) {
      if (this.blockTime[0]['log'].hasOwnProperty('epochTimeStamp')) {
        this.pastRateFetch = true;
        let timestamp = +this.blockTime[0]['log']['epochTimeStamp'].$date;
        this.marketService.getMarketPrice(timestamp, this.currencyType)
          .subscribe(data => {
            let returnRate = 0;
            if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                this.tempRate = data[i];
                returnRate = returnRate + this.tempRate[this.currencyType];
              }
              this.pastRate = returnRate / data.length;
            }
            else {
              this.pastRateFetch = false;
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

  formatAmount(type: string, amount: number, returnSymbol: boolean): string {
    //Mnano
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
    //nano
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
    else if (type == 'ETH') {
      if (returnSymbol) {
        return 'Ξ' + amount.toFixed(6);
      }
      else {
        return amount.toFixed(6);
      }
    }
    else if (type == 'BTC') {
      if (returnSymbol) {
        return '₿' + amount.toFixed(6);
      }
      else {
        return amount.toFixed(6);
      }
    }
    else if (type == 'JPY') {
      if (returnSymbol) {

        return '¥' + amount.toFixed(0);
      }
      else {
        return amount.toFixed(0);
      }
    }
    else if (type == 'CNY') {
      if (returnSymbol) {

        return '¥' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'USD') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }

      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'SEK') {
      if (returnSymbol) {

        return amount.toFixed(2) + 'kr';
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'CHF') {
      if (returnSymbol) {

        return '₣' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'ZAR') {
      if (returnSymbol) {

        return 'R' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'EUR') {
      if (returnSymbol) {

        return '€' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'GBP') {
      if (returnSymbol) {

        return '£' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'CAD') {
      if (returnSymbol) {

        return 'C$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'MXN') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'AUD') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'BRL') {
      if (returnSymbol) {

        return 'R$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'VES') {
      if (returnSymbol) {

        return 'Bs.' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else {
      return amount.toFixed(2);
    }
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
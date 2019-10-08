import { Component, OnInit } from '@angular/core';
import { MarketService } from '../market.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
tempRate: number;
nowDate: Date;

priceResultsNowUSD: number;
priceResultsNowBTC: number;
priceResultsDayUSD: number;
priceResultsDayBTC: number;
priceResultsWeekUSD: number;
priceResultsWeekBTC: number;

  constructor(private marketService: MarketService, private messageService: MessageService) { }

  ngOnInit() {
    this.nowDate = new Date();
    this.getPriceNow();
    this.getPriceDay();
    this.getPriceWeek();
  }

  getPriceNow() {
    this.priceResultsNowUSD = null;
    this.priceResultsNowBTC = null;
    this.marketService.getMarketPrice(this.nowDate.getTime(), 'USD')
      .subscribe(data => {
        let returnRate = 0;
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempRate = data[i];
            returnRate = returnRate + this.tempRate['USD'];
          }
          this.priceResultsNowUSD = returnRate / data.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
      this.marketService.getMarketPrice(this.nowDate.getTime(), 'BTC')
      .subscribe(data => {
        let returnRate = 0;
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempRate = data[i];
            returnRate = returnRate + this.tempRate['BTC'];
          }
          this.priceResultsNowBTC = returnRate / data.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
  }

  getPriceDay() {
    this.priceResultsDayUSD = null;
    this.priceResultsDayBTC = null;
    this.marketService.getMarketPrice(this.nowDate.getTime()-(1*24*60*60*1000), 'USD')
      .subscribe(data => {
        let returnRate = 0;
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempRate = data[i];
            returnRate = returnRate + this.tempRate['USD'];
          }
          this.priceResultsDayUSD = returnRate / data.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
      this.marketService.getMarketPrice(this.nowDate.getTime()-(1*24*60*60*1000), 'BTC')
      .subscribe(data => {
        let returnRate = 0;
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempRate = data[i];
            returnRate = returnRate + this.tempRate['BTC'];
          }
          this.priceResultsDayBTC = returnRate / data.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
  }

  getPriceWeek() {
    this.priceResultsWeekUSD = null;
    this.priceResultsWeekBTC = null;
    this.marketService.getMarketPrice(this.nowDate.getTime()-(7*24*60*60*1000), 'USD')
      .subscribe(data => {
        let returnRate = 0;
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempRate = data[i];
            returnRate = returnRate + this.tempRate['USD'];
          }
          this.priceResultsWeekUSD = returnRate / data.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
      this.marketService.getMarketPrice(this.nowDate.getTime()-(7*24*60*60*1000), 'BTC')
      .subscribe(data => {
        let returnRate = 0;
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempRate = data[i];
            returnRate = returnRate + this.tempRate['BTC'];
          }
          this.priceResultsWeekBTC = returnRate / data.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
  }

  private log(message: string) {
    this.messageService.add(`Account Component: ${message}`);
  }
}

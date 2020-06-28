import { Component, OnInit } from '@angular/core';
import { NanoodleService } from '../nanoodle.service';
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

  constructor(private nanoodleService: NanoodleService, private messageService: MessageService) { }

  ngOnInit() {
    this.nowDate = new Date();
    this.getPriceNow();
    this.getPriceDay();
    this.getPriceWeek();
  }

  getPriceNow() {
    this.priceResultsNowUSD = null;
    this.priceResultsNowBTC = null;
    this.nanoodleService.getPrice(this.nowDate)
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate['USD'];
          }
          this.priceResultsNowUSD = returnRate / results.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
      this.nanoodleService.getPrice(this.nowDate)
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate['BTC'];
          }
          this.priceResultsNowBTC = returnRate / results.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
  }

  getPriceDay() {
    this.priceResultsDayUSD = null;
    this.priceResultsDayBTC = null;
    this.nanoodleService.getPrice(new Date(this.nowDate.getTime()-(1*24*60*60*1000)))
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate['USD'];
          }
          this.priceResultsDayUSD = returnRate / results.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
      this.nanoodleService.getPrice(new Date(this.nowDate.getTime()-(1*24*60*60*1000)))
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate['BTC'];
          }
          this.priceResultsDayBTC = returnRate / results.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
  }

  getPriceWeek() {
    this.priceResultsWeekUSD = null;
    this.priceResultsWeekBTC = null;
    this.nanoodleService.getPrice(new Date(this.nowDate.getTime()-(7*24*60*60*1000)))
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate['USD'];
          }
          this.priceResultsWeekUSD = returnRate / results.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
      this.nanoodleService.getPrice(new Date(this.nowDate.getTime()-(7*24*60*60*1000)))
      .subscribe(data => {
        var results = data['Items'];
        let returnRate = 0;
        if (results && results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            this.tempRate = results[i]['priceData'];
            returnRate = returnRate + this.tempRate['BTC'];
          }
          this.priceResultsWeekBTC = returnRate / results.length;
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

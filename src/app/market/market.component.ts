import { Component, OnInit } from '@angular/core';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
lastPrice: number;
day: number;
week: number;
month: number;
nowDate: Date;

  constructor(private marketService: MarketService) { }

  ngOnInit() {
    this.nowDate = new Date();
    console.log(this.marketService.getMarketPrice(this.nowDate.getTime(), 'USD'));
    console.log(this.marketService.getMarketPrice(this.nowDate.getTime() - 24 * 60 * 60 * 1000, 'USD'));
    console.log(this.marketService.getMarketPrice(this.nowDate.getTime() - 24 * 7 * 60 * 60 * 1000, 'USD'));
    console.log(this.marketService.getMarketPrice(this.nowDate.getTime() - 24 * 7 * 60 * 60 * 1000, 'USD'));
  }
}

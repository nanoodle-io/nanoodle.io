import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { NodeService } from '../node.service';
import { NetworkService } from '../network.service';
import { MarketService } from '../market.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-live-component',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  @ViewChild("transactionChart") chart: BaseChartDirective;
  @ViewChild("currencyChart") chart1: BaseChartDirective;
  @ViewChild("priceChart") chart2: BaseChartDirective;

  blockCountResults: BlockCountResults;
  transactionDatasets = [
    { data: [1, 1, 1, 1], label: 'Value Transactions' }
  ];
  transactionLabels = [1, 2, 3, 4]

  chartOptions = {
    responsive: true
  };

  lastPriceTime = null;

  currencyDatasets = [
    { data: [1, 1, 1, 1], label: 'Nano' },
    { data: [1, 1, 1, 1], label: 'GBP' },
    { data: [1, 1, 1, 1], label: 'USD' },
    { data: [1, 1, 1, 1], label: 'CNY' , hidden: true},
    { data: [1, 1, 1, 1], label: 'JPY' , hidden: true},
    { data: [1, 1, 1, 1], label: 'EUR' },
    { data: [1, 1, 1, 1], label: 'BTC' , hidden: true}
  ];

  priceDatasets = [
    { data: [1, 1, 1, 1], label: 'GBP' },
    { data: [1, 1, 1, 1], label: 'USD' },
    { data: [1, 1, 1, 1], label: 'CNY' , hidden: true},
    { data: [1, 1, 1, 1], label: 'JPY' , hidden: true},
    { data: [1, 1, 1, 1], label: 'EUR' },
    { data: [1, 1, 1, 1], label: 'BTC' , hidden: true}
  ];

  constructor(private messageService: MessageService, private NodeService: NodeService, private marketService: MarketService, private NetworkService: NetworkService) { }

  ngOnInit() {
    this.getBlockCount();
    this.getChartData();
    this.getLastPrice();
  }

  getBlockCount(): void {
    this.NodeService.getBlockCount()
      .subscribe(data => {
        this.blockCountResults = data;
      });
  }

  getLastPrice(): void {
    this.marketService.getLastMarketPrice()
    .subscribe(data => {
      let tempDate = new Date(data[0]['log']['epochTimeStamp']['$date']);
      this.lastPriceTime = this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + "-" + this.pad2(tempDate.getFullYear()) + " " + this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes());
    });
  }

  getChartData(): void {
    let trxTemp = [];
    let timestampTemp = [];
    //totals
    let nanoTemp = [];
    let gbpTemp = [];
    let usdTemp = [];
    let btcTemp = [];
    let cnyTemp = [];
    let jpyTemp = [];
    let eurTemp = [];
    //price
    let gbpPriceTemp = [];
    let usdPriceTemp = [];
    let btcPriceTemp = [];
    let cnyPriceTemp = [];
    let jpyPriceTemp = [];
    let eurPriceTemp = [];

    this.NetworkService.getChartData(168)
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          trxTemp.push(data[i]['transactions']);
          //work out values
          nanoTemp.push(this.formatAmount('XRB', +data[i]['rawTotal'], false));
          gbpTemp.push(this.formatAmount('GBP',+this.formatAmount('XRB', +data[i]['rawTotal'], false) * +data[i]['GBP'],false));
          usdTemp.push(this.formatAmount('USD',+this.formatAmount('XRB', +data[i]['rawTotal'], false) * +data[i]['USD'],false));
          cnyTemp.push(this.formatAmount('CNY',+this.formatAmount('XRB', +data[i]['rawTotal'], false) * +data[i]['CNY'],false));
          jpyTemp.push(this.formatAmount('JPY',+this.formatAmount('XRB', +data[i]['rawTotal'], false) * +data[i]['JPY'],false));
          eurTemp.push(this.formatAmount('EUR',+this.formatAmount('XRB', +data[i]['rawTotal'], false) * +data[i]['EUR'],false));
          btcTemp.push(this.formatAmount('BTC',+this.formatAmount('XRB', +data[i]['rawTotal'], false) * +data[i]['BTC'],false));

          gbpPriceTemp.push(this.formatAmount('GBP',+data[i]['GBP'],false));
          usdPriceTemp.push(this.formatAmount('USD',+data[i]['USD'],false));
          cnyPriceTemp.push(this.formatAmount('CNY',+data[i]['CNY'],false));
          jpyPriceTemp.push(this.formatAmount('JPY',+data[i]['JPY'],false));
          eurPriceTemp.push(this.formatAmount('EUR',+data[i]['EUR'],false));
          btcPriceTemp.push(this.formatAmount('BTC',+data[i]['BTC'],false));

          let tempDate = new Date(data[i]['log']['epochTimeStamp']['$date']);
          timestampTemp.push(this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + " " + this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes()));
        }
        this.transactionLabels = timestampTemp;
        this.transactionDatasets = [
          { data: trxTemp, label: 'Nano Value Transactions' }
        ];

        this.currencyDatasets = [
          { data: nanoTemp, label: 'Nano' },
          { data: gbpTemp, label: 'GBP' },
          { data: usdTemp, label: 'USD' },
          { data: cnyTemp, label: 'CNY', hidden: true},
          { data: jpyTemp, label: 'JPY' , hidden: true},
          { data: eurTemp, label: 'EUR' },
          { data: btcTemp, label: 'BTC' , hidden: true}
        ];

        this.priceDatasets = [
          { data: gbpPriceTemp, label: 'GBP' },
          { data: usdPriceTemp, label: 'USD' },
          { data: cnyPriceTemp, label: 'CNY' , hidden: true},
          { data: jpyPriceTemp, label: 'JPY' , hidden: true},
          { data: eurPriceTemp, label: 'EUR' },
          { data: btcPriceTemp, label: 'BTC' , hidden: true}
        ];

        this.reloadChart();
      });

  }

  reloadChart() {
    if (this.chart !== undefined) {
      this.chart.chart.destroy();
      this.chart.chart = 0;

      this.chart.datasets = this.transactionDatasets;
      this.chart.labels = this.transactionLabels;
      this.chart.ngOnInit();
    }

    if (this.chart1 !== undefined) {
      this.chart1.chart.destroy();
      this.chart1.chart = 0;

      this.chart1.datasets = this.currencyDatasets;
      this.chart1.labels = this.transactionLabels;
      this.chart1.ngOnInit();
    }

    if (this.chart2 !== undefined) {
      this.chart2.chart.destroy();
      this.chart2.chart = 0;

      this.chart2.datasets = this.priceDatasets;
      this.chart2.labels = this.transactionLabels;
      this.chart2.ngOnInit();
    }
  }

  //date helper functions
  pad2(n) { return n < 10 ? '0' + n : n }

  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
  }

  private log(message: string) {
    this.messageService.add(`Representative Component: ${message}`);
  }

  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
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
    else if (type == 'PEN') {
      if (returnSymbol) {

        return 'S/.' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'COP') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else if (type == 'ARS') {
      if (returnSymbol) {

        return '$' + amount.toFixed(2);
      }
      else {
        return amount.toFixed(2);
      }
    }
    else {
      return amount.toFixed(2);
    }
  }
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}
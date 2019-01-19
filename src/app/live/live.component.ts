import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { NodeService } from '../node.service';
import { NetworkService } from '../network.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-live-component',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  @ViewChild("baseChart") chart: BaseChartDirective;
  @ViewChild("baseChart1") chart1: BaseChartDirective;

  blockCountResults: BlockCountResults;
  transactionDatasets = [
    { data: [1, 2, 3, 4], label: 'Value Transactions' }
  ];
  transactionLabels = [1, 2, 3, 4]
 
  chartOptions = {
    responsive: true
  };
  
currencyDatasets = [
    { data: [1, 2, 3, 4], label: 'Nano' },
      { data: [1, 2, 3, 4], label: 'GBP' },
      { data: [1, 2, 3, 4], label: 'USD' },
      { data: [1, 2, 3, 4], label: 'BTC' }
  ];

  constructor(private messageService: MessageService, private NodeService: NodeService, private NetworkService: NetworkService) { }

  ngOnInit() {
    this.getBlockCount();
    this.getChartData();
  }

  getBlockCount(): void {
    this.NodeService.getBlockCount()
      .subscribe(data => {
        this.blockCountResults = data;
      });
  }

  getChartData(): void {
    let trxTemp = [];
    let timestampTemp = [];
    let nanoTemp = [];
    let gbpTemp = [];
    let usdTemp = [];
    let btcTemp = [];
    this.NetworkService.getChartData(168)
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          trxTemp.push(data[i]['transactions']);
          //work out values
          nanoTemp.push(this.formatAmount('XRB',+data[i]['rawTotal'],false));
          gbpTemp.push(+this.formatAmount('XRB',+data[i]['rawTotal'],false)*+data[i]['GBP']);
          usdTemp.push(+this.formatAmount('XRB',+data[i]['rawTotal'],false)*+data[i]['USD']);
          btcTemp.push(+this.formatAmount('XRB',+data[i]['rawTotal'],false)*+data[i]['BTC']);
          let tempDate = new Date(data[i]['log']['epochTimeStamp']['$date']);
          timestampTemp.push(this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + "-" + tempDate.getFullYear().toString() + " " +this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes()));
        }
        this.transactionLabels = timestampTemp;
        this.transactionDatasets = [
          { data: trxTemp, label: 'Nano Value Transactions' }
        ];

        this.currencyDatasets = [
          { data: nanoTemp, label: 'Nano' },
          { data: gbpTemp, label: 'GBP' },
          { data: usdTemp, label: 'USD' },
          { data: btcTemp, label: 'BTC' }
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
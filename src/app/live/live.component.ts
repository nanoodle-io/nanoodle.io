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

  blockCountResults: BlockCountResults;
  transactionDatasets = [
    { data: [1, 2, 3, 4], label: 'Value Transactions' }
  ];
  transactionLabels = [1, 2, 3, 4]
 
  chartOptions = {
    responsive: true
  };
  
  currencyType: string;

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
    this.NetworkService.getChartData(168)
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          trxTemp.push(data[i]['transactions']);
          let tempDate = new Date(data[i]['log']['epochTimeStamp']['$date']);
          timestampTemp.push(this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + "-" + tempDate.getFullYear().toString() + " " +this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes()));
        }
        this.transactionLabels = timestampTemp;
        this.transactionDatasets = [
          { data: trxTemp, label: 'Nano Value Transactions' }
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
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}
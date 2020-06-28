import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { NodeService } from '../node.service';
import { NanoodleService } from '../nanoodle.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-live-component',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  @ViewChild("transactionChart", { static: true }) chart: BaseChartDirective;
  @ViewChild("currencyChart", { static: true }) chart1: BaseChartDirective;
  @ViewChild("priceChart", { static: true }) chart2: BaseChartDirective;
  @ViewChild("sizeChart", { static: true }) chart3: BaseChartDirective;
  @ViewChild("transactionDayChart", { static: true }) chart4: BaseChartDirective;

  transactionDatasets = [
    { data: [1, 1, 1, 1], label: 'Hourly Value Transactions' }
  ];
  transactionLabels = ["1", "2", "3", "4"];
  transactionLabelsExtended = ["1", "2", "3", "4"];

  transactionDayDatasets = [
    { data: [1, 1, 1, 1], label: 'Daily Value Transactions' }
  ];
  transactionDayLabels = ["1", "2", "3", "4"];

  chartOptions = {
    responsive: true
  };

  doughnutChartLabels = ['Microtransaction ( < $0.01)', 'Small ( < $1)', 'Standard', 'Large ( > $1000)'];
  doughnutChartData = [1, 1, 1, 1];
  doughnutChartType = 'doughnut';

  lastPriceTime = null;

  currencyDatasets = [
    { data: [1, 1, 1, 1], label: 'Nano' },
    { data: [1, 1, 1, 1], label: 'GBP' },
    { data: [1, 1, 1, 1], label: 'USD' },
    { data: [1, 1, 1, 1], label: 'CNY', hidden: true },
    { data: [1, 1, 1, 1], label: 'JPY', hidden: true },
    { data: [1, 1, 1, 1], label: 'EUR', hidden: true },
    { data: [1, 1, 1, 1], label: 'BTC', hidden: true }
  ];

  priceDatasets = [
    { data: [1, 1, 1, 1], label: 'GBP' },
    { data: [1, 1, 1, 1], label: 'USD' },
    { data: [1, 1, 1, 1], label: 'CNY', hidden: true },
    { data: [1, 1, 1, 1], label: 'JPY', hidden: true },
    { data: [1, 1, 1, 1], label: 'EUR', hidden: true },
    { data: [1, 1, 1, 1], label: 'BTC', hidden: true }
  ];

  constructor(private messageService: MessageService, private nodeService: NodeService, private nanoodleService: NanoodleService) { }

  ngOnInit() {
    this.getHourlyChartData();
    this.getDailyChartData();
    this.getLastPrice();
  }

  getLastPrice(): void {
    this.nanoodleService.getPrice(new Date())
      .subscribe(data => {
        let tempDate = new Date(data['Items'][data['Count']-1]['priceTimestamp']);
        this.lastPriceTime = this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + "-" + this.pad2(tempDate.getFullYear()) + " " + this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes());
      });
  }

  getDailyChartData(): void {
    let trxTemp = [];
    let timestampTemp = [];

    //get up to a years worth of daily data
    this.nanoodleService.getDailyChartData()
      .subscribe(data => {
        var results = data['Items'];
        for (var i = 0; i < results.length; i++) {
          trxTemp.push(results[i]['value transactions total']);
          let tempDate = new Date(results[i]['endDate']);
          timestampTemp.push(this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + "-" + this.pad2(tempDate.getFullYear()));
        }
        this.transactionDayLabels = timestampTemp;
        this.transactionDayLabels.reverse();
        this.transactionDayDatasets = [
          { data: trxTemp.reverse(), label: 'Daily Value Transactions' }
        ];
        this.reloadDailyChart();
      });
  }

  getHourlyChartData(): void {
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

    let nanoMicro = 0;
    let nanoSmall = 0;
    let nanoNormal = 0;
    let nanoLarge = 0;

    this.nanoodleService.getHourlyChartData()
      .subscribe(data => {
        var results = data['Items'];

        //4 weeks hourly price data
        for (var i = 0; i < results.length; i++) {
          let tempDate = new Date(results[i]['endDate']);
          timestampTemp.push(this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + " " + this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes()));
       
          gbpPriceTemp.push(this.nanoodleService.formatAmount('GBP', +results[i]['averageGBP'], false));
          usdPriceTemp.push(this.nanoodleService.formatAmount('USD', +results[i]['averageUSD'], false));
          cnyPriceTemp.push(this.nanoodleService.formatAmount('CNY', +results[i]['averageCNY'], false));
          jpyPriceTemp.push(this.nanoodleService.formatAmount('JPY', +results[i]['averageJPY'], false));
          eurPriceTemp.push(this.nanoodleService.formatAmount('EUR', +results[i]['averageEUR'], false));
          btcPriceTemp.push(this.nanoodleService.formatAmount('BTC', +results[i]['averageBTC'], false));
        }
        this.priceDatasets = [
          { data: gbpPriceTemp.reverse(), label: 'GBP' },
          { data: usdPriceTemp.reverse(), label: 'USD' },
          { data: cnyPriceTemp.reverse(), label: 'CNY', hidden: true },
          { data: jpyPriceTemp.reverse(), label: 'JPY', hidden: true },
          { data: eurPriceTemp.reverse(), label: 'EUR', hidden: true },
          { data: btcPriceTemp.reverse(), label: 'BTC', hidden: true }
        ];
        this.transactionLabelsExtended = timestampTemp;
        this.transactionLabelsExtended.reverse();

        //reset
        timestampTemp = [];

        //get last week size and value
        for (var i = 0; i < results.length; i++) {
          trxTemp.push(results[i]['value transactions total']);
          //work out values
          nanoTemp.push(this.nanoodleService.formatAmount('XRB', +results[i]['raw total'], false));
          gbpTemp.push(this.nanoodleService.formatAmount('GBP', +this.nanoodleService.formatAmount('XRB', +results[i]['raw total'], false) * +results[i]['averageGBP'], false));
          usdTemp.push(this.nanoodleService.formatAmount('USD', +this.nanoodleService.formatAmount('XRB', +results[i]['raw total'], false) * +results[i]['averageUSD'], false));
          cnyTemp.push(this.nanoodleService.formatAmount('CNY', +this.nanoodleService.formatAmount('XRB', +results[i]['raw total'], false) * +results[i]['averageCNY'], false));
          jpyTemp.push(this.nanoodleService.formatAmount('JPY', +this.nanoodleService.formatAmount('XRB', +results[i]['raw total'], false) * +results[i]['averageJPY'], false));
          eurTemp.push(this.nanoodleService.formatAmount('EUR', +this.nanoodleService.formatAmount('XRB', +results[i]['raw total'], false) * +results[i]['averageEUR'], false));
          btcTemp.push(this.nanoodleService.formatAmount('BTC', +this.nanoodleService.formatAmount('XRB', +results[i]['raw total'], false) * +results[i]['averageBTC'], false));

          nanoMicro = nanoMicro + +results[i]['micro total'];
          nanoSmall = nanoSmall + +results[i]['small total'];
          nanoNormal = nanoNormal + +results[i]['normal total'];
          nanoLarge = nanoLarge + +results[i]['large total'];

          let tempDate = new Date(results[i]['endDate']);
          timestampTemp.push(this.pad2(tempDate.getDate()) + "-" + this.pad2(tempDate.getMonth() + 1) + " " + this.pad2(tempDate.getHours()) + ":" + this.pad2(tempDate.getMinutes()));
        }
        this.transactionLabels = timestampTemp;
        this.transactionLabels.reverse()
        this.transactionDatasets = [
          { data: trxTemp.reverse(), label: 'Hourly Value Transactions' }
        ];

        this.currencyDatasets = [
          { data: usdTemp.reverse(), label: 'USD' },
          { data: nanoTemp.reverse(), label: 'NANO' },
          { data: gbpTemp.reverse(), label: 'GBP', hidden: true },
          { data: cnyTemp.reverse(), label: 'CNY', hidden: true },
          { data: jpyTemp.reverse(), label: 'JPY', hidden: true },
          { data: eurTemp.reverse(), label: 'EUR', hidden: true },
          { data: btcTemp.reverse(), label: 'BTC', hidden: true }
        ];
        this.doughnutChartData = [+nanoMicro, +nanoSmall, +nanoNormal, +nanoLarge];

        this.reloadHourlyChart();
      });

  }

  reloadHourlyChart() {
    if (this.chart !== undefined) {
      this.chart.chart.destroy();
      this.chart.chart = null;

      this.chart.datasets = this.transactionDatasets;
      this.chart.labels = this.transactionLabels;
      this.chart.ngOnInit();
    }

    if (this.chart1 !== undefined) {
      this.chart1.chart.destroy();
      this.chart1.chart = null;

      this.chart1.datasets = this.currencyDatasets;
      this.chart1.labels = this.transactionLabels;
      this.chart1.ngOnInit();
    }

    if (this.chart2 !== undefined) {
      this.chart2.chart.destroy();
      this.chart2.chart = null;

      this.chart2.datasets = this.priceDatasets;
      this.chart2.labels = this.transactionLabelsExtended;
      this.chart2.ngOnInit();
    }

    if (this.chart3 !== undefined) {
      this.chart3.chart.destroy();
      this.chart3.chart = null;
      this.chart3.labels = this.doughnutChartLabels;
      this.chart3.data = this.doughnutChartData;
      this.chart3.ngOnInit();
    }

  }

  reloadDailyChart() {
    if (this.chart4 !== undefined) {
      this.chart4.chart.destroy();
      this.chart4.chart = null;

      this.chart4.datasets = this.transactionDayDatasets;
      this.chart4.labels = this.transactionDayLabels;
      this.chart4.ngOnInit();
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
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
  }
}
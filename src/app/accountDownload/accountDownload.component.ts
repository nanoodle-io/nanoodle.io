import { Component, Inject, Input } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { saveAs } from 'file-saver/FileSaver';
import { AccountService } from '../account.service';
import { BlockService } from '../block.service';
import { MessageService } from '../message.service';
import { MarketService } from '../market.service';

export interface DialogData {
  format: string;
  last: string;
}

@Component({
  selector: 'app-accountDownload',
  templateUrl: './accountDownload.component.html',
  styleUrls: ['./accountDownload.component.css']
})
export class AccountDownloadComponent {

  //processing
  processing: boolean = false;
  //raw results
  blockTimes: BlockTime[];
  blockTimeResults: BlockTime[];
  pastPrice: string;
  accountResults: Account;
  unprocessedBlocksResults: UnprocessedBlocks;
  detail: Detail;
  keys: string[];
  blockResults: Block[];
  blockResult: Block;
  tempPrice: FiatResults;
  contents: Content;
  unprocessedPart: string[];
  key: string;
  selection: DialogData;
  downloadString: string[];
  //param
  paramsub: any;
  error: string;
  reg = new RegExp('"error"');

  @Input()
  identifier: string;
  
  @Input() currencyType: string;

  @Input() utcOffset: string;

  constructor(public dialog: MatDialog, private marketService: MarketService, private messageService: MessageService, private accountService: AccountService, private blockService: BlockService) { }

  openDialog(): void {
    this.selection = {
      format: '',
      last: ''
    };
    this.accountResults = null;

    const dialogRef = this.dialog.open(AccountDownloadComponentDialog, {
      width: '260px',
      data: { selection: this.selection }
    });

    dialogRef.componentInstance.utcOffset = this.utcOffset;
    dialogRef.componentInstance.currencyType = this.currencyType;

    dialogRef.afterClosed().subscribe(result => {
      this.selection = result;

      if (this.selection != null) {
        this.processing = true;

        if (this.selection.format == "csv")
          this.saveAccountCSV(this.identifier, +this.selection.last, this.currencyType, this.utcOffset);
      }
    });
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  saveAccountCSV(accountParam: string, size: number, currencyType: string, utcOffset: string): void {
    //queries
    let hashes = [];
    let queryTimes = [];
    let queryBlocks = [];
    let queryPrice = [];
    let time = "";
    let status = "";
    let direction = "";
    let offset = 0;
    //download data
    this.downloadString = [];
    this.downloadString.push("time utc" + utcOffset + ",transaction type,block type,processing status,account,xno amount," + currencyType.toLowerCase() + " amount then,hash\n");

    this.accountService.getUnprocessedBlocks(accountParam, size)
      .subscribe(data => {
        this.unprocessedBlocksResults = data;
        this.accountService.getAccount(accountParam, size - this.unprocessedBlocksResults['blocks'].length)
          .subscribe(data => {
            this.accountResults = data;
            var y;
            for (y = 0; y < this.unprocessedBlocksResults['blocks'].length; y++) {
              hashes.push(this.unprocessedBlocksResults['blocks'][y]);
            }
            for (var i = 0; i < this.accountResults['history'].length; i++) {
              hashes.push(this.accountResults['history'][i]['hash']);
            }
            hashes.forEach((item) => {
              queryTimes.push(this.blockService.getBlockTime(item));
              queryBlocks.push(this.blockService.getBlock(item));
            });
            //wait for returns
            const combinedBlocks = forkJoin(
              queryBlocks
            )
            const combinedTimes = forkJoin(
              queryTimes
            )
            //process results
            combinedBlocks.subscribe(data => {
              this.blockResults = data;
              combinedTimes.subscribe(data => {
                this.blockTimeResults = data;
                for (var i = 0; i < data.length; i++) {

                  this.blockTimes = data[i];

                  if (this.blockTimes.length > 0) {
                    if (this.blockTimes[0]['log'].hasOwnProperty('epochTimeStamp')) {
                      queryPrice.push(this.marketService.getMarketPrice(+this.blockTimes[0]['log']['epochTimeStamp'].$date,currencyType));
                    }
                    else {
                      queryPrice.push(of([]));
                    }
                  }
                  else {
                    queryPrice.push(of([]));
                  }
                }
                const combinedPrice = forkJoin(
                  queryPrice
                )
                combinedPrice.subscribe(data => {
                  for (var i = 0; i < this.blockTimeResults.length; i++) {
                    //time
                    if (Object.keys(this.blockTimeResults[i]).length > 0) {
                      time = this.formatDate(+this.blockTimeResults[i][0]['log']['epochTimeStamp'].$date + (+utcOffset * 3600000));
                    }
                    else {
                      time = "not recorded";
                    }

                    //block details
                    this.blockResult = JSON.parse(this.formatContents(JSON.stringify(this.blockResults[i])));
                    this.key = JSON.stringify(Object.keys(this.blockResult['blocks'])[0]).replace(/\"/g, '');
                    this.detail = this.blockResult['blocks'][this.key];
                    this.contents = this.detail['contents'];

                    //price details
                    let returnPrice = 0;
                    if (data[i].length > 0) {
                      for (var x = 0; x < data[i].length; x++) {
                        this.tempPrice = data[i][x];
                        returnPrice = returnPrice + this.tempPrice[currencyType];
                      }
                      this.pastPrice = "" + this.formatDecimals(returnPrice / data[i].length * +this.formatAmount(+this.detail.amount,5),4);
                    }
                    else {
                      this.pastPrice = "not recorded";
                    }

                    //construct csv
                    if (accountParam == this.contents.account) {
                      status = "processed";
                    }
                    else {
                      status = "unprocessed";
                    }

                    if (status == "unprocessed") {
                      direction = "receive";
                    }
                    else {
                      direction = this.accountResults['history'][i-y].type;
                    }

                    this.downloadString.push(time + "," + direction + "," + this.contents.type + "," + status + "," + this.contents.account + "," + this.formatAmount(+this.detail.amount, 5) + "," + this.pastPrice + "," + this.key + "\n");

                  }
                  const blob = new Blob(this.downloadString, { type: 'text/plain' });
                  this.processing = false;
                  saveAs(blob, "nanoodle_" + this.identifier + "." + this.selection.format);
                });
              });
            });

          });
      });
  }

  formatDate(rawDate: number): string {
    let myDate = new Date(rawDate);
    return myDate.toLocaleString();
  }

  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
  }

  formatAmount(mRai: number, places: number): string {
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
    return temp.toFixed(places);
  }

  private log(message: string) {
    this.messageService.add(`Account Download Component: ${message}`);
  }

  modalClose($event) {
  }

}


@Component({
  selector: 'app-accountDownloadDialog',
  templateUrl: './accountDownloadDialog.html',
  styleUrls: ['./accountDownload.component.css']
})
export class AccountDownloadComponentDialog {

  currencyType: string;
  utcOffset: string;

  constructor(
    public dialogRef: MatDialogRef<AccountDownloadComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

interface Transaction {
  type: string;
  account: string;
  amount: number;
  hash: string;
}

interface Account {
  account?: string;
  history?: Transaction[];
  previous?: string;
  error?: string;
}

interface UnprocessedBlocks {
  blocks: string[];
}

interface Detail {
  block_account: string;
  amount: string;
  contents: Content;
}

interface Content {
  type: string;
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account: string;
  signature: string;
  work: string;
}

interface Block {
  [detail: string]: Detail;
}

interface BlockTime {
  _id: string;
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
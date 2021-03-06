import { Component, Inject, Input } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver/FileSaver';
import { NodeService } from '../node.service';
import { MessageService } from '../message.service';
import { NanoodleService } from '../nanoodle.service';

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
  blockTimeResults: BlockTime[][];
  pastPrice: string;
  accountResults: Account;
  unprocessedBlocksResults: UnprocessedBlocks;
  detail: Detail;
  date: Date;
  balanceResults: Balance;
  keys: string[];
  blockResults: Block[];
  blockResult: Block;
  tempPrice: FiatResults;
  contents: Content;
  unprocessedPart: string[];
  key: string;
  selection: DialogData;
  downloadString: string[];
  transactionString: string[];
  //param
  paramsub: any;

  @Input()
  identifier: string;

  @Input() currencyType: string;

  @Input() utcOffset: string;

  constructor(public dialog: MatDialog, private nanoodleService: NanoodleService, private nodeService: NodeService, private messageService: MessageService) { }

  openDialog(): void {
    this.selection = {
      format: '',
      last: ''
    };

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

        this.saveAccount(this.identifier, +this.selection.last, this.currencyType, this.utcOffset);
      }
    });
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  saveAccount(accountParam: string, size: number, currencyType: string, utcOffset: string): void {
    //queries
    let hashes = [];
    let queryTimes = [];
    let queryBlocks = [];
    let queryPrice = [];
    let time = "";
    let earliest = 99999999999999999999999999999999999;
    let latest = 0;
    let status = "";
    let direction = "";
    let name = "";
    let memo = "";
    this.downloadString = [];
    this.transactionString = [];
    this.nodeService.getUnprocessedBlocks(accountParam, size)
      .subscribe(data => {
        this.unprocessedBlocksResults = data;
        this.nodeService.getAccount(accountParam, size - this.unprocessedBlocksResults['blocks'].length)
          .subscribe(data => {
            this.accountResults = data;
            var y;
            for (y = 0; y < this.unprocessedBlocksResults['blocks'].length; y++) {
              hashes.push(this.unprocessedBlocksResults['blocks'][y]);
            }
            if (this.accountResults.hasOwnProperty('history')) {
              for (var i = 0; i < this.accountResults['history'].length; i++) {
                hashes.push(this.accountResults['history'][i]['hash']);
              }
            }
            hashes.forEach((item) => {
              queryTimes.push(this.nanoodleService.getBlockTime(item));
              queryBlocks.push(this.nodeService.getBlock(item));
            });
            //wait for returns
            const combinedBlocks = forkJoin(
              queryBlocks
            )
            const combinedTimes = forkJoin(
              queryTimes
            )
            //process results
            combinedBlocks.subscribe((data: Block[]) => {
              this.blockResults = data;
              combinedTimes.subscribe((data: BlockTime[][]) => {
                this.blockTimeResults = data;
                for (var i = 0; i < this.blockTimeResults.length; i++) {

                  this.blockTimes = this.blockTimeResults[i];
                  if (this.blockTimes.length > 0) {
                    if (this.blockTimes[0]['log'].hasOwnProperty('epochTimeStamp')) {
                      queryPrice.push(this.nanoodleService.getPrice(new Date(+this.blockTimes[0]['log']['epochTimeStamp'].$date)));
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
                combinedPrice.subscribe((data: any[]) => {
                  for (var i = 0; i < this.blockTimeResults.length; i++) {
                    //time
                    if (Object.keys(this.blockTimeResults[i]).length > 0) {
                      //only epochresults (not datetime)
                      if (this.selection.format == "csv") {
                        time = this.formatDate(+this.blockTimeResults[i][0]['log']['epochTimeStamp'].$date + (+utcOffset * 3600000));
                      }
                      else {
                        if (+this.blockTimeResults[i][0]['log']['epochTimeStamp'].$date < earliest) {
                          earliest = +this.blockTimeResults[i][0]['log']['epochTimeStamp'].$date;
                        }
                        if (+this.blockTimeResults[i][0]['log']['epochTimeStamp'].$date > latest) {
                          latest = +this.blockTimeResults[i][0]['log']['epochTimeStamp'].$date;
                        }
                        this.date = new Date(+this.blockTimeResults[i][0]['log']['epochTimeStamp'].$date + (+utcOffset * 3600000));
                        time = this.date.getFullYear().toString() + this.pad2(this.date.getMonth() + 1) + this.pad2(this.date.getDate()) + this.pad2(this.date.getHours()) + this.pad2(this.date.getMinutes()) + this.pad2(this.date.getSeconds());
                      }
                    }
                    else {
                      //time = "not recorded";
                      time = "19700101010101";
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
                      this.pastPrice = "" + this.nanoodleService.formatAmount(currencyType, returnPrice / data[i].length * +this.nanoodleService.formatAmount('XRB', +this.detail.amount, false), true);
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
                      direction = this.accountResults['history'][i - y].type;
                    }

                    //add transaction
                    if (this.selection.format == "csv") {
                      if (direction == "send") {
                        memo = accountParam;
                        name = this.accountResults['history'][i - y].account;
                      }
                      else {
                        if (status == "unprocessed") {
                          memo = this.contents.account;
                          name = accountParam;
                        }
                        else {
                          memo = this.accountResults['history'][i - y].account;
                          name = accountParam;
                        }
                      }
                      this.transactionString.push("\"" + time + "\"," + direction + "," + this.contents.type + "," + status + "," + name + "," + memo + "," + this.nanoodleService.formatAmount('XRB', +this.detail.amount, true) + "," + this.pastPrice + "," + this.key + "\n");
                    }
                    else {
                      this.transactionString.push("<STMTTRN>\n");

                      if (direction == "send") {
                        this.transactionString.push("<TRNTYPE>DEBIT\n");

                      }
                      else {
                        this.transactionString.push("<TRNTYPE>CREDIT\n");
                      }
                      this.transactionString.push("<DTPOSTED>" + time + "[" + utcOffset + "]\n");
                      if (direction == "send") {
                        this.transactionString.push("<TRNAMT>-" + new Intl.NumberFormat('en-GB', {
                          style: 'decimal',
                          useGrouping: false,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6
                        }).format(+this.nanoodleService.formatAmount('XRB', +this.detail.amount, false)));

                      }
                      else {
                        this.transactionString.push("<TRNAMT>" + new Intl.NumberFormat('en-GB', {
                          style: 'decimal',
                          useGrouping: false,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6
                        }).format(+this.nanoodleService.formatAmount('XRB', +this.detail.amount, false)));

                      }
                      this.transactionString.push("<FITID>" + this.key + "\n");

                      if (direction == "send") {
                        memo = "from: " + accountParam;
                        name = this.accountResults['history'][i - y].account;
                      }
                      else {
                        if (status == "unprocessed") {
                          memo = "from: " + this.contents.account;
                          name = accountParam;
                        }
                        else {
                          memo = "from: " + this.accountResults['history'][i - y].account;
                          name = accountParam;
                        }
                      }
                      this.transactionString.push("<NAME>" + name + "\n");
                      this.transactionString.push("<MEMO>" + memo + ", " + this.currencyType + " then:" + this.pastPrice + "\n");
                      this.transactionString.push("</STMTTRN>\n");
                    }
                  }

                  this.date = new Date(Date.now() + (+utcOffset * 3600000));
                  time = this.date.getFullYear().toString() + this.pad2(this.date.getMonth() + 1) + this.pad2(this.date.getDate()) + this.pad2(this.date.getHours()) + this.pad2(this.date.getMinutes()) + this.pad2(this.date.getSeconds());

                  if (this.selection.format == "csv") {
                    this.downloadString.push("time utc" + utcOffset + ",transaction type,block type,processing status,payee,payer,xrb amount," + currencyType.toLowerCase() + " amount then,hash\n");
                    //add in transactions, without comma
                    for (var x = 0; x < this.transactionString.length; x++) {
                      this.downloadString.push(this.transactionString[x]);
                    }
                    //save csv
                    this.processing = false;
                    const blob = new Blob(this.downloadString, { type: 'text/plain' });
                    saveAs(blob, "nanoodle_" + this.identifier + "." + this.selection.format);
                  }
                  else {
                    this.nodeService.getBalance(accountParam)
                      .subscribe(data => {
                        this.balanceResults = data;

                        this.downloadString.push("OFXHEADER:100\n");
                        this.downloadString.push("DATA:OFXSGML\n");
                        this.downloadString.push("VERSION:102\n");
                        this.downloadString.push("SECURITY:NONE\n");
                        this.downloadString.push("ENCODING:USASCII\n");
                        this.downloadString.push("CHARSET:1252\n");
                        this.downloadString.push("COMPRESSION:NONE\n");
                        this.downloadString.push("OLDFILEUID:NONE\n");
                        this.downloadString.push("NEWFILEUID:NONE\n\n");

                        this.downloadString.push("<OFX>\n");
                        this.downloadString.push("<SIGNONMSGSRSV1>\n");
                        this.downloadString.push("<SONRS>\n");
                        this.downloadString.push("<STATUS>\n");
                        //Code
                        this.downloadString.push("<CODE>0\n");
                        this.downloadString.push("<SEVERITY>INFO\n");
                        this.downloadString.push("</STATUS>\n");
                        this.downloadString.push("<DTSERVER>" + time + "[" + utcOffset + "]\n");
                        this.downloadString.push("<LANGUAGE>ENG\n");
                        this.downloadString.push("</SONRS>\n");
                        this.downloadString.push("</SIGNONMSGSRSV1>\n");
                        this.downloadString.push("<BANKMSGSRSV1>\n");
                        this.downloadString.push("<STMTTRNRS>\n");
                        //?
                        this.downloadString.push("<TRNUID>1\n");
                        this.downloadString.push("<STATUS>\n");
                        this.downloadString.push("<CODE>0\n");
                        this.downloadString.push("<SEVERITY>INFO\n");
                        this.downloadString.push("</STATUS>\n");
                        this.downloadString.push("<STMTRS>\n");
                        //ticker
                        this.downloadString.push("<CURDEF>XRB\n");
                        this.downloadString.push("<BANKACCTFROM>\n");
                        //bank is NANO
                        this.downloadString.push("<BANKID>NANO\n");
                        this.downloadString.push("<ACCTID>" + accountParam + "\n");
                        //checking account
                        this.downloadString.push("<ACCTTYPE>CHECKING\n");
                        this.downloadString.push("</BANKACCTFROM>\n");
                        this.downloadString.push("<BANKTRANLIST>\n");
                        //earliest date
                        this.date = new Date(+earliest + (+utcOffset * 3600000));
                        time = this.date.getFullYear().toString() + this.pad2(this.date.getMonth() + 1) + this.pad2(this.date.getDate()) + this.pad2(this.date.getHours()) + this.pad2(this.date.getMinutes()) + this.pad2(this.date.getSeconds());
                        this.downloadString.push("<DTSTART>" + time + "[" + utcOffset + "]\n");
                        //latest date
                        this.date = new Date(+latest + (+utcOffset * 3600000));
                        time = this.date.getFullYear().toString() + this.pad2(this.date.getMonth() + 1) + this.pad2(this.date.getDate()) + this.pad2(this.date.getHours()) + this.pad2(this.date.getMinutes()) + this.pad2(this.date.getSeconds());
                        this.downloadString.push("<DTEND>" + time + "[" + utcOffset + "]\n");

                        //add in transactions, without comma
                        for (var x = 0; x < this.transactionString.length; x++) {
                          this.downloadString.push(this.transactionString[x]);
                        }

                        this.downloadString.push("</BANKTRANLIST>\n");
                        this.downloadString.push("<LEDGERBAL>\n");
                        this.downloadString.push("<BALAMT>" + this.nanoodleService.formatAmount('XRB', (+this.balanceResults.balance + +this.balanceResults.pending), false) + "\n");
                        //current datetime
                        this.date = new Date(Date.now() + (+utcOffset * 3600000));
                        time = this.date.getFullYear().toString() + this.pad2(this.date.getMonth() + 1) + this.pad2(this.date.getDate()) + this.pad2(this.date.getHours()) + this.pad2(this.date.getMinutes()) + this.pad2(this.date.getSeconds());
                        this.downloadString.push("<DTASOF>" + time + "[" + utcOffset + "]\n");
                        this.downloadString.push("</LEDGERBAL>\n");
                        this.downloadString.push("<AVAILBAL>\n");
                        this.downloadString.push("<BALAMT>" + this.nanoodleService.formatAmount('XRB', +this.balanceResults.balance, false) + "\n");
                        //re-use current datetime
                        this.downloadString.push("<DTASOF>" + time + "[" + utcOffset + "]\n");
                        this.downloadString.push("</AVAILBAL>\n");
                        this.downloadString.push("</STMTRS>\n");

                        this.downloadString.push("</STMTTRNRS>\n");
                        this.downloadString.push("</BANKMSGSRSV1>\n");
                        this.downloadString.push("</OFX>\n");

                        //save ofx
                        this.processing = false;
                        const blob = new Blob(this.downloadString, { type: 'text/plain' });
                        saveAs(blob, "nanoodle_" + this.identifier + "." + this.selection.format);
                      })
                  }
                });
              });
            });
          });
      });
  }

  formatDate(rawDate: number): string {
    let myDate = new Date(rawDate);
    return myDate.toLocaleString('en-GB', { timeZone: 'UTC' });
  }

  //date helper functions
  pad2(n) { return n < 10 ? '0' + n : n }

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

interface Balance {
  balance: string;
  pending: string;
}

interface FiatResults {
  [currencyType: string]: number;
}
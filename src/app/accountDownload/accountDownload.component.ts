import { Component, Inject, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { saveAs } from 'file-saver/FileSaver';
import { AccountService } from '../account.service';
import { BlockService } from '../block.service';
import { MessageService } from '../message.service';
import { isNull } from 'util';


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
  accountResults: Account;
  unprocessedBlocksResults: UnprocessedBlocks;
  detail: Detail;
  tempvar: BlockTime[];
  blockResults: BlockResults;
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

  constructor(public dialog: MatDialog, private messageService: MessageService, private accountService: AccountService, private blockService: BlockService) { }

  openDialog(): void {
    this.selection = {
      format: '',
      last: ''
    };
    this.accountResults = null;

    const dialogRef = this.dialog.open(AccountDownloadComponentDialog, {
      width: '255px',
      data: { selection: this.selection }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selection = result;

      if (this.selection != null) {
        this.processing = true;
        this.saveAccount(this.identifier, +this.selection.last);
      }
    });
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  saveAccount(accountParam: string, size: number): void {
    let hashes = [];
    let results: BlockTime[] = [];
    let timeQueries = [];
    let resultsString: string[] = [];
    this.downloadString = [];
    this.downloadString.push("Nanoodle Time (UTC), Type, Account, Amount, Hash\n");

    this.accountService.getAccount(accountParam, size)
      .subscribe(data => {
        this.accountResults = data;
        for (var i = 0; i < this.accountResults['history'].length; i++) {
          hashes.push(this.accountResults['history'][i]['hash']);
        }
        hashes.forEach((item) => {
          timeQueries.push(this.blockService.getBlockTime(item));
        });
        const combined = forkJoin(
          timeQueries
        )
        combined.subscribe(data => {

          results = data;

          results.forEach((item) => {

            if (Object.keys(item).length > 0) {
              resultsString.push(this.formatDate(item[0]['log']['dateTime']));
            }
            else {
              resultsString.push("Not Recorded");
            }
          });

          for (var i = 0; i < this.accountResults['history'].length; i++) {
            this.downloadString.push(resultsString[i] + "," + this.accountResults['history'][i]['type'] + "," + this.accountResults['history'][i]['account'] + "," + this.formatAmount(this.accountResults['history'][i]['amount']) + "," + this.accountResults['history'][i]['hash'] + "\n");
          }
          const blob = new Blob(this.downloadString, { type: 'text/plain' });
          this.processing = false;
          saveAs(blob, "nanoodle_" + this.identifier + "." + this.selection.format);
        });
      });
  }

  formatDate(rawDate: string): string {
    return rawDate.match(/\d{2}\/[A-Za-z]{3}\/\d{4}/) + " " + ("" + rawDate.match(/\d{2}:\d{2}:\d{2} /)).trim();
  }

  formatAmount(mRai: number): string {
    const dec = 6;
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
    return temp.toFixed(dec);
  }

  private log(message: string) {
    this.messageService.add(`Account Component: ${message}`);
  }

}


@Component({
  selector: 'app-accountDownloadDialog',
  templateUrl: './accountDownloadDialog.html',
  styleUrls: ['./accountDownload.component.css']
})
export class AccountDownloadComponentDialog {

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

interface BlockResults {
  error?: string;
  blocks?: Block[];
}

interface BlockTime {
  _id: string;
  log: Time;
}

interface Time {
  dateTime: string;
}
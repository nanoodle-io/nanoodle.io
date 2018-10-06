import { Component, Inject, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { saveAs } from 'file-saver/FileSaver';
import { AccountService } from '../account.service';
import { BlockService } from '../block.service';
import { MessageService } from '../message.service';


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
  keys: string[];
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
      width: '260px',
      data: { selection: this.selection }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selection = result;

      if (this.selection != null) {
        this.processing = true;

        if (this.selection.format == "csv")
          this.saveAccountCSV(this.identifier, +this.selection.last);
      }
    });
  }

  //RPC block results have a bunch of extra characters that need removing before a parse
  formatContents(jsonRepParam: string): string {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
  }

  saveAccountCSV(accountParam: string, size: number): void {
    //queries
    let hashes = [];
    let blockQueries = [];
    let time = "";
    let status = "";
    let direction = "";
    let offset = 0;
    //download data
    this.downloadString = [];
    this.downloadString.push("nanoodle time (utc),transaction type,block type,processing status,account,amount,hash\n");

    this.accountService.getUnprocessedBlocks(accountParam, size)
      .subscribe(data => {
        this.unprocessedBlocksResults = data;
        this.accountService.getAccount(accountParam, size - this.unprocessedBlocksResults['blocks'].length)
          .subscribe(data => {
            this.accountResults = data;
            for (var i = 0; i < this.unprocessedBlocksResults['blocks'].length; i++) {
              hashes.push(this.unprocessedBlocksResults['blocks'][i]);
            }
            for (var i = 0; i < this.accountResults['history'].length; i++) {
              hashes.push(this.accountResults['history'][i]['hash']);
            }
            hashes.forEach((item) => {
              blockQueries.push(this.blockService.getBlockTime(item));
              blockQueries.push(this.blockService.getBlock(item));
            });
            const combined = forkJoin(
              blockQueries
            )
            combined.subscribe(data => {                

              for (var i = 0; i < data.length ; i = i + 2) {
                if (Object.keys(data[i]).length > 0) {
                  time = this.formatDate(data[i][0]['log']['dateTime']);
                }
                else {
                  time = "not recorded";
                }

                this.blockResults = JSON.parse(this.formatContents(JSON.stringify(data[i + 1])));
                this.key = JSON.stringify(Object.keys(this.blockResults['blocks'])[0]).replace(/\"/g, '');
                this.detail = this.blockResults['blocks'][this.key];
                this.contents = this.detail['contents'];

                if (accountParam == this.contents.account) {
                  status = "processed";
                }
                else {
                  status = "unprocessed";
                }

                if (status == "unprocessed") {
                  //work out the position when excluding the unprocessed blocks
                  offset = offset + 1;
                  direction = "receive";
                }
                else {
                  direction = this.accountResults['history'][(i / 2) - offset].type;
                }

                this.downloadString.push(time + "," + direction + "," + this.contents.type + "," + status + "," + this.contents.account + "," + this.formatAmount(+this.detail.amount) + "," + this.key + "\n");

              }
              const blob = new Blob(this.downloadString, { type: 'text/plain' });
              this.processing = false;
              saveAs(blob, "nanoodle_" + this.identifier + "." + this.selection.format);
            });
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

  modalClose( $event ) {
    console.log($event); // { submitted: true }
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
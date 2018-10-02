import { Component, Inject, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { saveAs } from 'file-saver/FileSaver';
import { AccountService } from '../account.service';
import { BlockService } from '../block.service';

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

  constructor(public dialog: MatDialog, private accountService: AccountService, private blockService: BlockService) { }

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
    this.accountService.getAccount(accountParam, size)
    .subscribe(data => {
      this.accountResults = data;
      
      this.downloadString = [];
      this.downloadString.push("Type, Account, Amount, Hash\n");
      for (var i = 0; i < this.accountResults['history'].length; i++) {
        this.downloadString.push(this.accountResults['history'][i]['type'] + "," + this.accountResults['history'][i]['account'] + "," + this.accountResults['history'][i]['amount'] + "," + this.accountResults['history'][i]['hash'] + "\n");
      }
      const blob = new Blob(this.downloadString, { type: 'text/plain' });
      this.processing = false;
      saveAs(blob, "nanoodle_" + this.identifier + "." + this.selection.format);
    });
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
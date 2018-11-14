import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { NodeService } from '../node.service';
import { AccountService } from '../account.service';
@Component({
  selector: 'app-reps',
  templateUrl: './reps.component.html',
  styleUrls: ['./reps.component.css']
})
export class RepsComponent implements OnInit {

  error: string;
  reg = new RegExp('"error"');
  blockCountResults: BlockCountResults;
  weightResults: WeightResult;
  versionResults: NodeVersion;

  constructor(private messageService: MessageService, private nodeService: NodeService, private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.blockCountResults = null;
    this.getBlockCount();
    this.versionResults = null;
    this.getVersion();
    this.weightResults = null;
    //NANOODLE Representative
    this.getWeight('xrb_1e6e41up4x5e4jke6wy4k6nnuagagspfx4tjafghub6cw46ueimqt657nx4a');
  }
  
  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
  }

  formatVersion(input: string): string {
    return input.match(/[\d.]+/g)[0];
  }

  formatAmount(mRai: number): string {
    const dec = 2;
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
    return temp.toFixed(dec);
  }

  getBlockCount(): void {
    this.nodeService.getBlockCount()
      .subscribe(data => {
        this.blockCountResults = data;
        if (this.reg.test(JSON.stringify(this.blockCountResults))) {
          this.error = JSON.stringify(this.blockCountResults['error']);
        }
      });
  }

  getVersion(): void {
    this.nodeService.getVersion()
      .subscribe(data => {
        this.versionResults = data;
        if (this.reg.test(JSON.stringify(this.blockCountResults))) {
          this.error = JSON.stringify(this.blockCountResults['error']);
        }
      });
  }

  getWeight(accountParam: string): void {
    this.accountService.getWeight(accountParam)
      .subscribe(data => {
        this.weightResults = data;
      });
  }

  private log(message: string) {
    this.messageService.add(`Representative Component: ${message}`);
  }
}

interface BlockCountResults {
  error?: string;
  count?: number;
  unchecked?: number;
}

interface NodeVersion {
  rpc_version: string,
  store_version: string,
  node_vendor: string
}

interface WeightResult {
  weight: string;
}
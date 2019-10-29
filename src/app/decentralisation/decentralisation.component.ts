import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';
import { NodeService } from '../node.service';
import { AccountService } from '../account.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reps',
  templateUrl: './decentralisation.component.html',
  styleUrls: ['./decentralisation.component.css']
})
export class DecentralisationComponent implements OnInit {

  error: string;
  reg = new RegExp('"error"');
  blockCountResults: BlockCountResults;
  repUrl: SafeUrl;
  weightResults: WeightResult;
  versionResults: NodeVersion;
  onlineRepResults: number;

  constructor(private sanitizer: DomSanitizer, private messageService: MessageService, private nodeService: NodeService, private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.blockCountResults = null;
    this.getBlockCount();
    this.onlineRepResults = 115000;
    this.calculatePR();
    this.versionResults = null;
    this.getVersion();
    this.weightResults = null;
    //NANOODLE Representative
    this.getWeight('nano_1e6e41up4x5e4jke6wy4k6nnuagagspfx4tjafghub6cw46ueimqt657nx4a');
    this.repUrl = this.sanitizer.bypassSecurityTrustResourceUrl("nanorep:nano_1e6e41up4x5e4jke6wy4k6nnuagagspfx4tjafghub6cw46ueimqt657nx4a?label=NANOODLE&message=Thank%20you%20for%20changing%20your%20representative.");
  }
  
  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
  }

  formatVersion(input: string): string {
    return input.match(/[\d.]+/g)[0];
  }

  calculatePR() {
    this.nodeService.getOnlineRepresentatives()
    .subscribe(data => {
      let results = data;
      this.onlineRepResults = +this.formatAmount(+results['online_stake_total']/1000)
    });
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

interface Quorum {
  quorum_delta: number,
  online_weight_quorum_percent: number,
  online_weight_minimum: number,
  online_stake_total: number,
  peers_stake_total: number,
  peers_stake_required: number 
}
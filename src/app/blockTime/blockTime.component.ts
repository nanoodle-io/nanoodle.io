import { Component, OnInit, Input } from '@angular/core';
import { BlockService } from '../block.service';
import { MessageService } from '../message.service';

@Component({
  selector: "app-blockTime",
  templateUrl: "./blockTime.component.html",
  styleUrls: ['./blockTime.component.css']
})

export class BlockTimeComponent implements OnInit {
  //Results
  blockTime: BlockTime;
  error: string;
  reg = new RegExp('"error"');

  @Input()
  hash: string;
  @Input()
  hyperlink: boolean;

  constructor(private messageService: MessageService, private blockService: BlockService) { }

  ngOnInit(): void {
    this.blockTime = null;
    this.getBlockTime(this.hash);
  }

  getBlockTime(blockParam: string): void {
    this.blockService.getBlockTime(blockParam)
      .subscribe(data => {
        this.blockTime = data;
        if (this.reg.test(JSON.stringify(this.blockTime))) {
          this.error = JSON.stringify(this.blockTime['error']);
        }
      });
  }

  formatDate(rawDate: string): string {
    return rawDate.match(/\d{2}\/[A-Za-z]{3}\/\d{4}/) + " " + ("" + rawDate.match(/\d{2}:\d{2}:\d{2} /)).trim();
  }

  private log(message: string) {
    this.messageService.add(`Block Component: ${message}`);
  }
}

interface BlockTime {
  _id: string;
  time: Time;
}

interface Time {
  dateTime: string;
}

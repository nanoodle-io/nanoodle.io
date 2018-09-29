import { Component, OnInit } from '@angular/core';
import { NodeService } from '../node.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-live-component',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  error: string;
  reg = new RegExp('"error"');
  frontierResults: FrontierResults;

  constructor(private messageService: MessageService, private nodeService: NodeService) { }

  ngOnInit() {
    this.frontierResults = null;
    this.getFrontierCount();
  }

  getFrontierCount(): void {
    this.nodeService.getFrontierCount()
      .subscribe(data => {
        this.frontierResults = data;
        if (this.reg.test(JSON.stringify(this.frontierResults))) {
          this.error = JSON.stringify(this.frontierResults['error']);
        }
      });
  }

  private log(message: string) {
    this.messageService.add(`Representative Component: ${message}`);
  }
}

interface FrontierResults {
  error?: string;
  count?: number;
}
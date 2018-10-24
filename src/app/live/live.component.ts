import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-live-component',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  blockCountResults: BlockCountResults;

  constructor(private messageService: MessageService, private NodeService: NodeService) { }

  ngOnInit() {
    this.getBlockCount();
  }

  getBlockCount(): void {
    this.NodeService.getBlockCount()
      .subscribe(data => {
        this.blockCountResults = data;
      });
  }

  formatDecimals(input: number, places: number): string {
    return input.toFixed(places);
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
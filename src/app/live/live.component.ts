import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-live-component',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  private log(message: string) {
    this.messageService.add(`Representative Component: ${message}`);
  }
}
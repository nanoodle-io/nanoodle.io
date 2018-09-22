import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-reps',
  templateUrl: './reps.component.html',
  styleUrls: ['./reps.component.css']
})
export class RepsComponent implements OnInit {

  error: string;
  reg = new RegExp('"error"');

  constructor(private messageService: MessageService, private route: ActivatedRoute) { }

  ngOnInit(): void {

  }


  private log(message: string) {
    this.messageService.add(`Representative Component: ${message}`);
  }

}

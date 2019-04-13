import {Component, Inject} from '@angular/core';
import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-tac',
  templateUrl: 'tac.component.html',
  styleUrls: ['./tac.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class TACComponent {

  constructor(public dialog: MatDialog) {}

  public openTACDialog(): void {
    let dialogRef = this.dialog.open(TACComponentDialog, {
      width: '400px',
      height: '500px',
      autoFocus: false,
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'app-tacDialog',
  templateUrl: 'tacDialog.html',
  styleUrls: ['./tac.component.css']
})
export class TACComponentDialog {

  constructor(
    public dialogRef: MatDialogRef<TACComponentDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
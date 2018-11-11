import {Component, Inject} from '@angular/core';
import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-donate',
  templateUrl: 'donate.component.html',
  styleUrls: ['./donate.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class DonateComponent {

  constructor(public dialog: MatDialog) {}

  public openDonateDialog(): void {
    let dialogRef = this.dialog.open(DonateComponentDialog, {
      width: '260px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'app-donateDialog',
  templateUrl: 'donateDialog.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponentDialog {

  constructor(
    public dialogRef: MatDialogRef<DonateComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
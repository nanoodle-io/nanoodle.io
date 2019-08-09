import {Component, Inject} from '@angular/core';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-privacy',
  templateUrl: 'privacy.component.html',
  styleUrls: ['./privacy.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class PrivacyComponent {

  constructor(public dialog: MatDialog) {}

  public openPrivacyDialog(): void {
    let dialogRef = this.dialog.open(PrivacyComponentDialog, {
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
  selector: 'app-privacyDialog',
  templateUrl: 'privacyDialog.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponentDialog {

  constructor(
    public dialogRef: MatDialogRef<PrivacyComponentDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
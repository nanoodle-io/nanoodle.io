import {Component, Inject} from '@angular/core';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

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
  donateUrl: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<DonateComponentDialog>, private sanitizer: DomSanitizer, 
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      this.donateUrl = this.sanitizer.bypassSecurityTrustResourceUrl("nano:nano_1e6e41up4x5e4jke6wy4k6nnuagagspfx4tjafghub6cw46ueimqt657nx4a");
    }

    copyToClipboard(str: string) {
      var el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
  
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        // save current contentEditable/readOnly status
        var editable = el.contentEditable;
        var readOnly = el.readOnly;
  
        // convert to editable with readonly to stop iOS keyboard opening
        el.contentEditable = editable;
        el.readOnly = true;
  
        // create a selectable range
        var range = document.createRange();
        range.selectNodeContents(el);
  
        // select the range
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);
  
        // restore contentEditable/readOnly to original state
        el.contentEditable = editable;
        el.readOnly = readOnly;
      } else {
        el.select();
      }
  
      document.execCommand('copy');
      document.body.removeChild(el);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
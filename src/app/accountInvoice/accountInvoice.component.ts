import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from '../message.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

export interface DialogData {
  identifier: string;
}

@Component({
  selector: 'app-accountInvoice',
  templateUrl: './accountInvoice.component.html',
  styleUrls: ['./accountInvoice.component.css']
})
export class AccountInvoiceComponent {

  selection: DialogData;

  @Input()
  identifier: string;

  constructor(public dialog: MatDialog, private messageService: MessageService) { }

  openDialog(): void {

    const dialogRef = this.dialog.open(AccountInvoiceComponentDialog, {
      width: '400px',
      height: '575px',
      autoFocus: false,
      data: { }
    });

    dialogRef.componentInstance.identifier = this.identifier;

    dialogRef.afterClosed().subscribe(data => {
    });

  }

  private log(message: string) {
    this.messageService.add(`Account Component: ${message}`);
  }

  modalClose($event) {
  }

}

@Component({
  selector: 'app-accountInvoiceDialog',
  templateUrl: './accountInvoiceDialog.html',
  styleUrls: ['./accountInvoice.component.css']
})
export class AccountInvoiceComponentDialog {

  identifier: string;
  invoiceUrl: SafeUrl;
  invoiceMessage: string;
  invoiceAmount: string;
  invoiceLabel: string;

  constructor(
    public dialogRef: MatDialogRef<AccountInvoiceComponentDialog>, private sanitizer: DomSanitizer, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


    //initial conversion methods
    calculateRaw(inputNumber: string): string {
      let rawtoMnano = 1000000000000000000000000000000;
      let decimalOffset = inputNumber.indexOf('.');
      //handle decimal
      if (decimalOffset > -1) {
        let mf = inputNumber.length - decimalOffset - 1;
        inputNumber = inputNumber.replace('.', '');
        let bigInt = inputNumber + "000000000000000000000000000000";
        bigInt = bigInt.substring(0, bigInt.length - mf);
        bigInt = bigInt.replace(/^0/, '');
        return bigInt;
      }
      else {
        let tempValue = inputNumber + "000000000000000000000000000000";
        return tempValue;
      }
    }

  invoiceString(invoiceAmount: string, invoiceLabel: string, invoiceMessage: string): string {
    let validCount = 0;
    let tempString = "";
    if (!isNaN(+invoiceAmount) && /^((0\.\d*[1-9]+\d*)|([1-9]\d*(\.\d+)?))$/.test(invoiceAmount)) {
      validCount++;
      tempString = tempString + "?amount=" + this.calculateRaw(this.invoiceAmount);
    }
    if (invoiceLabel != null && /^.+$/.test(invoiceLabel)) {
      if (validCount > 0) {
        tempString = tempString + "&";
      }
      else {
        tempString = tempString + "?";
      }
      tempString = tempString + "label=" + encodeURIComponent(invoiceLabel);
      validCount++;
    }
    if (invoiceMessage != null && /^.+$/.test("" + invoiceMessage)) {
      if (validCount > 0) {
        tempString = tempString + "&";
      }
      else {
        tempString = tempString + "?";
      }
      tempString = tempString + "message=" + encodeURIComponent(invoiceMessage);
    }
    tempString = "nano:" + this.identifier + tempString;
    this.invoiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tempString);
    return tempString;
  }

  stringFormControl = new FormControl('', [
    Validators.pattern(/^.+$/)
  ]);

  numberFormControl = new FormControl('', [
    Validators.pattern(/^((0\.\d*[1-9]+\d*)|([1-9]\d*(\.\d+)?))$/)
  ]);

  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
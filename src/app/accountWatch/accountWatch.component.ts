import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '../message.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NanoodleService } from '../nanoodle.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

export interface DialogData {
  email: string;
}

@Component({
  selector: 'app-accountWatch',
  templateUrl: './accountWatch.component.html',
  styleUrls: ['./accountWatch.component.css']
})
export class AccountWatchComponent {

  //processing
  result: DialogData;
  addWatcherError: string;
  addWatcher: string;

  @Input()
  identifier: string;

  constructor(public dialog: MatDialog, private messageService: MessageService, private nanoodleService: NanoodleService) { }

  openDialog(): void {
    this.addWatcherError = "";
    this.addWatcher = "";

    const dialogRef = this.dialog.open(AccountWatchComponentDialog, {
      width: '260px',
      data: { email: "" }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.result = data;
      if (this.result != null) {
        this.nanoodleService.putWatch(this.identifier, this.result.email).subscribe(res => {
          this.addWatcher = "Success";
        },
          (err: HttpErrorResponse) => {
            this.addWatcherError = err.message;
          }
        );
      }
    });
  }

  private log(message: string) {
    this.messageService.add(`Account Component: ${message}`);
  }

  modalClose($event) {
  }

}

@Component({
  selector: 'app-accountWatchDialog',
  templateUrl: './accountWatchDialog.html',
  styleUrls: ['./accountWatch.component.css']
})
export class AccountWatchComponentDialog {

  constructor(
    public dialogRef: MatDialogRef<AccountWatchComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
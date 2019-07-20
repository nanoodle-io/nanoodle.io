import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MarketService } from '../market.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  invoiceAddress: string;
  invoiceUrl: SafeUrl;
  invoiceMessage: string;
  invoiceAmount: string;
  invoiceLabel: string;
  priceResults: number;
  overrideRate: number;
  tempRate: FiatResults;
  currencyType: string;

  constructor(private sanitizer: DomSanitizer, private marketService: MarketService, private messageService: MessageService) { }

  ngOnInit() {
    let storedCurrency = localStorage.getItem('currencyType');
    if (storedCurrency) {
      this.currencyType = storedCurrency;
    }
    else {
      this.currencyType = 'GBP';
    }
    this.getPrice();
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

  getPrice() {
    localStorage.setItem('currencyType', this.currencyType);
    this.priceResults = null;
    this.marketService.getMarketPrice(Date.now(), this.currencyType)
      .subscribe(data => {
        let returnRate = 0;
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            this.tempRate = data[i];
            returnRate = returnRate + this.tempRate[this.currencyType];
          }
          this.priceResults = returnRate / data.length;
        }
        else {
          this.log("Cannot Retrieve Price Data");
        }
      });
  }

  invoiceString(invoiceAmount: string, invoiceAddress: string, invoiceLabel: string, invoiceMessage: string): string {
    let validCount = 0;
    let tempString = "";
    let tempAmount = "";
    if (!isNaN(this.overrideRate) && this.overrideRate != 0 && !this.rateFormControl.hasError('pattern'))
    {
      tempAmount = "" + (+invoiceAmount / this.overrideRate);
    }
    else
    {
      tempAmount = "" + (+invoiceAmount / this.priceResults);
    }
    if (!isNaN(+tempAmount) && /^((0\.\d*[1-9]+\d*)|([1-9]\d*(\.\d+)?))$/.test(tempAmount)) {
      validCount++;
      tempString = tempString + "?amount=" + this.calculateRaw(tempAmount);
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
    tempString = "nano:" + invoiceAddress + tempString;
    this.invoiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tempString);
    return tempString;
  }

  stringFormControl = new FormControl('', [
    Validators.pattern(/^.+$/)
  ]);

  rateFormControl = new FormControl('', [
    Validators.pattern(/^((0\.\d*[1-9]+\d*)|([1-9]\d*(\.\d+)?))$/)
  ]);

  amountFormControl = new FormControl('', [
    Validators.pattern(/^((0\.\d*[1-9]+\d*)|([1-9]\d*(\.\d+)?))$/)
  ]);

  addressFormControl = new FormControl('', [
    Validators.pattern(/^(xrb_|nano_|XRB_|NANO_)[a-zA-Z0-9]{60}$/) 
  ]);

  matcher = new MyErrorStateMatcher();

  private log(message: string) {
    this.messageService.add(`Account Component: ${message}`);
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface FiatResults {
  [currencyType: string]: number;
}
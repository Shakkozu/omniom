import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';
import { FormErrorHandler } from '../../../shared/form-error-handler';
import { TermsAndConditionsDialogComponent } from './terms-and-conditions-dialog/terms-and-conditions-dialog.component';
import { NutritionistRestService, RegisterNutritionistCommand } from '../../nutritionist-rest.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RegisterNutritionist } from '../../store/nutritionist.actions';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {
  form!: FormGroup;
  files: File[] = [];
  public maxSingleFileSizeInMB = 3;
  public maxAttachemntsTotalSizeInMB = 10;
  private singleMBInBytes = 1024 * 1024;

  constructor (private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private formErrorHandler: FormErrorHandler,
    private router: Router,
    private store: Store,
    private restService: NutritionistRestService) {
    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      termsAndConditions: new FormControl(false, Validators.requiredTrue),
    });
  }

  public get attachementsProvided(): boolean {
    return this.files.length > 0;
  }

  public onTermsClicked() {
    const dialogRef = this.dialog.open(TermsAndConditionsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.form.controls['termsAndConditions'].setValue(result);
      this.form.controls['termsAndConditions'].updateValueAndValidity();
    });
  }

  public get formInvalid(): boolean {
    return this.form.invalid || this.formFilesSizeExceeded || this.termsAndConditionsNotAccepted;
  }

  public get termsAndConditionsNotAccepted(): boolean {
    return this.form.controls['termsAndConditions'].value !== true && this.form.touched;
  }
  
  public onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files) return;
    const tooLargeFileThreshold = this.singleMBInBytes * this.maxSingleFileSizeInMB;
    const tooLargeFiles = Array.from(fileInput.files).filter(file => file.size > tooLargeFileThreshold);
    const filesWithInvalidExtensions = Array.from(fileInput.files).filter(file => file.name.split('.').pop() !== 'pdf');
    let errorMessage = '';

    if (filesWithInvalidExtensions.length > 0) {
      errorMessage = `Wybrano pliki o nieprawidłowym formacie. Wszystkie pliki muszą być w formacie PDF. Nieprawidłowe pliki:`;
      filesWithInvalidExtensions.forEach(file => errorMessage += `\n${ file.name }`);
      errorMessage += '\n\n';
    }

    if (tooLargeFiles.length > 0) {
      errorMessage += `Wybrano pliki o zbyt dużym rozmiarze. Maksymalny rozmiar pliku to ${ this.maxSingleFileSizeInMB }MB. Nieprawidłowe pliki:`;
      tooLargeFiles.forEach(file => errorMessage += `\n${ file.name } - ${ this.convertSizeInBytesToNearestAppropriateUnit(file.size) }`);
    }

    if (errorMessage) {
      this.openErrorDialog(errorMessage);
      return;
    }
    
    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];
      

      if (this.files.find(_file => _file.name === file.name))
        continue;

      this.files.push(fileInput.files[i]);
    }
  }

  public removeFile(index: number) {
    this.files = this.files.filter((_, i) => i !== index);
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.formInvalid) {
      return;
    }

    let command: RegisterNutritionistCommand = {
      name: this.form.value.name,
      surname: this.form.value.surname,
      city: this.form.value.city,
      email: this.form.value.email,
      termsAndConditionsAccepted: this.form.value.termsAndConditions,
      files: this.files
    };

    this.store.dispatch(new RegisterNutritionist(command));
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  public convertSizeInBytesToNearestAppropriateUnit(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' Bytes';
    } else if (sizeInBytes < this.singleMBInBytes) {
      const sizeInKB = sizeInBytes / 1024;
      return this.roundTo2DecimalPlaces(sizeInKB) + ' KB';
    } else {
      const sizeInMB = sizeInBytes / (this.singleMBInBytes);
      return this.roundTo2DecimalPlaces(sizeInMB) + ' MB'; 
    }
  }

  private roundTo2DecimalPlaces(sizeInKB: number) {
    return Math.round(sizeInKB * 100) / 100;
  }

  public get totalAttachmentsSizeInMB(): number {
    const totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
    return this.convertSizeToMB(totalSize);
  }

  public get formFilesSizeExceeded(): boolean {
    const totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
    return this.convertSizeToMB(totalSize) > this.maxAttachemntsTotalSizeInMB;
  }

  convertSizeToMB(sizeInBytes: number): number {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return this.roundTo2DecimalPlaces(sizeInMB);
  }

  public getErrorMessage(formControlName: string): string {
    return this.formErrorHandler.handleError(this.form, formControlName);
  }

  openErrorDialog(errorMessage: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: {
        errorMessage: errorMessage
      }
    });
  }
}

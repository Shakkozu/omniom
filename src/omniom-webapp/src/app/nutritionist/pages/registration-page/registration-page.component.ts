import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {
  form!: FormGroup;
  files: File[] = [];
  private maxMBFileSize = 3;

  constructor (private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      documents: new FormControl([], [Validators.required]),
    });
   }

  convertSize(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' Bytes';
    } else if (sizeInBytes < 1024 * 1024) {
      const sizeInKB = sizeInBytes / 1024;
      return Math.round(sizeInKB * 100) / 100 + ' KB';
    } else {
      const sizeInMB = sizeInBytes / (1024 * 1024);
      return Math.round(sizeInMB * 100) / 100 + ' MB'; 
    }
  }

  public getErrorMessage(formControlName: string): string {
    return this.form?.getError(formControlName);
  }

  openErrorDialog(errorMessage: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: {
        errorMessage: errorMessage
      }
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files) return;
    const tooLargeFileThreshold = 1024 * 1024 * this.maxMBFileSize; // 2MB

    const tooLargeFiles = Array.from(fileInput.files).filter(file => file.size > tooLargeFileThreshold);
    if (tooLargeFiles.length > 0) {
      let errorMessage = `Wybrano pliki o zbyt dużym rozmiarze. Maksymalny rozmiar pliku to ${ this.maxMBFileSize}MB. Nieprawidłowe pliki:`;
      tooLargeFiles.forEach(file => errorMessage += `\n${ file.name } - ${ this.convertSize(file.size)}`);
      this.openErrorDialog(errorMessage.trim());
      return;
    }

    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];
      
      if (this.files.find(_file => _file.name === file.name))
        continue;
      
      this.files.push(fileInput.files[i]);
      const documents = this.form.controls['documents'].value;
      this.form.controls['documents'].setValue([...documents, file]);
    }
  }

  convertSizeToMB(sizeInBytes: number): number {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return Math.round(sizeInMB * 100) / 100;
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  onSubmit() {
    console.log(this.form.value);
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

}

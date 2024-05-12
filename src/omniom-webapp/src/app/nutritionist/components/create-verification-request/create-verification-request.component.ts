import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormErrorHandler } from '../../../shared/form-error-handler';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../shared/error-dialog/error-dialog.component';
import { Store } from '@ngxs/store';
import { CreateVerificationRequest } from '../../store/nutritionist.actions';

@Component({
  selector: 'app-create-verification-request',
  template: `
  <div class="p-4">
  <h1>Weryfikacja kwalifikacji dietetycznych</h1>
  <p>Wybierz pliki poświadczające kwalifikacje dietetyczne, które zostaną zweryfikowane przez nasz zespół.</p>
  <form mat-form [formGroup]="form" (submit)="onSubmit()">
  <div>
			<input type="file" #fileInput style="display: none" (change)="onFileSelected($event)" multiple>
			<button type="button" color="primary" mat-stroked-button (click)="triggerFileInput(fileInput)">Wybierz
				pliki</button>
			<mat-error *ngIf="formFilesSizeExceeded">Maksymalny rozmiar załączników to
				{{maxAttachemntsTotalSizeInMB}}MB. Aktualny rozmiar: {{totalAttachmentsSizeInMB}}MB</mat-error>
		</div>
		<div>
			<mat-action-list>
				<mat-list-item #tooltip="matTooltip" [matTooltip]="file.name" *ngFor="let file of files; index as i">
					<mat-icon matListItemIcon>description</mat-icon>
          <div matListItemTitle>
            {{ file.name }} {{convertSizeInBytesToNearestAppropriateUnit(file.size)}}
          </div>
					<button matListItemMeta type="button" mat-icon-button (click)="removeFile(i)">
						<mat-icon>delete</mat-icon>
					</button>
				</mat-list-item>
			</mat-action-list>
		</div>
    <mat-error *ngIf="files.length === 0" class="text-red-500">
    Co najmniej jeden plik jest wymagany do weryfikacji
    </mat-error>
    <div class="absolute bottom-4 right-4">
      <button [disabled]="files.length < 1" type="submit" mat-raised-button color="primary">Złóż wniosek</button>
    </div>
	</form>
</div>
  `,
  styleUrl: './create-verification-request.component.scss'
})
export class CreateVerificationRequestComponent {
  form!: FormGroup;
  files: File[] = [];
  public maxSingleFileSizeInMB = 3;
  public maxAttachemntsTotalSizeInMB = 10;
  private singleMBInBytes = 1024 * 1024;
  constructor(
    private formBuilder: FormBuilder,
    private formErrorHandler: FormErrorHandler,
    private dialog: MatDialog,
    private store: Store
  ) {

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
      filesWithInvalidExtensions.forEach(file => errorMessage += `\n${file.name}`);
      errorMessage += '\n\n';
    }

    if (tooLargeFiles.length > 0) {
      errorMessage += `Wybrano pliki o zbyt dużym rozmiarze. Maksymalny rozmiar pliku to ${this.maxSingleFileSizeInMB}MB. Nieprawidłowe pliki:`;
      tooLargeFiles.forEach(file => errorMessage += `\n${file.name} - ${this.convertSizeInBytesToNearestAppropriateUnit(file.size)}`);
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

  onSubmit() {
    if(this.formFilesSizeExceeded || this.files.length < 1)
      return;

    this.store.dispatch(new CreateVerificationRequest(this.files))
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

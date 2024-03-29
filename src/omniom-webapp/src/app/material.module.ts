import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

const MaterialComponents = [
	MatToolbarModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatButtonModule,
	MatNativeDateModule,
	MatSidenavModule,
	MatIconModule,
	MatButtonToggleModule,
	MatListModule,
	MatTableModule,
	MatPaginatorModule,
	MatOptionModule,
	MatRadioModule,
	MatDialogModule,
	MatSortModule,
	MatGridListModule,
	MatCardModule,
	MatMenuModule,
	MatFormFieldModule,
	MatInputModule,
	MatStepperModule,
	MatDatepickerModule,
	MatExpansionModule,
	MatSelectModule,
];

@NgModule({
	imports: [MaterialComponents],
	exports: [MaterialComponents]
})
export class MaterialModule { }
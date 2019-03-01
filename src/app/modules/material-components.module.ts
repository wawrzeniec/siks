import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, 
  MatCheckboxModule, 
  MatMenuModule, 
  MatIconModule, 
  MatCardModule,
  MatToolbarModule, 
  MatFormFieldModule, 
  MatInputModule,
  MatDialogModule,
  MatStepperModule,
  MatSelectModule, 
  MatProgressSpinnerModule, 
  MatNativeDateModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table'
import { MatDatepickerModule } from '@angular/material/datepicker'
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  imports: [BrowserAnimationsModule, MatButtonModule, MatCheckboxModule, 
            MatMenuModule, MatIconModule, MatCardModule, MatToolbarModule, 
            MatFormFieldModule, MatInputModule, MatDialogModule, MatStepperModule, 
            MatSelectModule, MatProgressSpinnerModule, MatTableModule,
            MatDatepickerModule, MatNativeDateModule, MatTooltipModule],

  exports: [BrowserAnimationsModule, MatButtonModule, MatCheckboxModule, 
    MatMenuModule, MatIconModule, MatCardModule, MatToolbarModule, 
    MatFormFieldModule, MatInputModule, MatDialogModule, MatStepperModule, 
    MatSelectModule, MatProgressSpinnerModule, MatTableModule,
    MatDatepickerModule, MatNativeDateModule, MatTooltipModule]
})
export class MaterialComponentsModule { }

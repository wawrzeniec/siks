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
  MatStepperModule} from '@angular/material';


@NgModule({
  imports: [BrowserAnimationsModule, MatButtonModule, MatCheckboxModule, 
            MatMenuModule, MatIconModule, MatCardModule, MatToolbarModule, 
            MatFormFieldModule, MatInputModule, MatDialogModule, MatStepperModule, 
            ],
  exports: [BrowserAnimationsModule, MatButtonModule, MatCheckboxModule, 
    MatMenuModule, MatIconModule, MatCardModule, MatToolbarModule, 
    MatFormFieldModule, MatInputModule, MatDialogModule, MatStepperModule, 
    ]
})
export class MaterialComponentsModule { }

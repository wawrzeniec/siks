import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatMenuModule, MatIconModule} from '@angular/material';


@NgModule({
  imports: [BrowserAnimationsModule, MatButtonModule, MatCheckboxModule, 
            MatMenuModule, MatIconModule],
  exports: [BrowserAnimationsModule, MatButtonModule, MatCheckboxModule,
            MatMenuModule, MatIconModule]
})
export class MaterialComponentsModule { }

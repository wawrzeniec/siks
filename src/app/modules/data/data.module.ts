import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class userDataContainer {
  userName: string;
  emailAddress: string;
  password: string;
}

@NgModule({
  declarations: [
    userDataContainer
  ],
  imports: [
    CommonModule
  ],
  exports: [
    userDataContainer
  ]
})
export class DataModule { 
  
}



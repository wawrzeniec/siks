import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class userDataContainer {
  userid: number;
  userName: string;
  emailAddress: string;
  password: string;
  firstname: string;
  lastname: string;
  target: number;
  weeklyreport: boolean;
  monthlyreport: boolean;
  errorreport: boolean;
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



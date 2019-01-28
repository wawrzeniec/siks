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
};

export class serverPacket {
  status: number;
  reason: string;
  data: Object;
  err: Object;
};



@NgModule({
  declarations: [
    userDataContainer,
    serverPacket
  ],
  imports: [
    CommonModule
  ],
  exports: [
    userDataContainer,
    serverPacket
  ]
})
export class DataModule { 
  
}



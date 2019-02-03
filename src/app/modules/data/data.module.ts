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

export class securityDescriptor {
  identifier: string;
  category: string;
  markets: string;
  currency: string;
  methods: methodDescriptor[];
  annualfee: number;
  watch: boolean;
}

export class methodDescriptor {
  methodid: string;
  parameters: string;
}


@NgModule({
  declarations: [
    userDataContainer,
    serverPacket,
    methodDescriptor, 
    securityDescriptor
  ],
  imports: [
    CommonModule
  ],
  exports: [
    userDataContainer,
    serverPacket,
    methodDescriptor,
    securityDescriptor
  ]
})
export class DataModule { 
  
}



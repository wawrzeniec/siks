import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class loginDataContainer {
  userName: string;
  password: string;
}

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
  type: string;
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

export enum ASSET_TYPES {
  CASH = 'Cash',
  SECURITY = 'Security',
  OTHER = 'Other'
};

@NgModule({
  declarations: [
    loginDataContainer,
    userDataContainer,
    serverPacket,
    methodDescriptor, 
    securityDescriptor
  ],
  imports: [
    CommonModule
  ],
  exports: [
    loginDataContainer,
    userDataContainer,
    serverPacket,
    methodDescriptor,
    securityDescriptor
  ]
})
export class DataModule { 
  
}



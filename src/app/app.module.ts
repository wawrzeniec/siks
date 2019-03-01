import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialComponentsModule } from '@app/modules/material-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddUserComponent } from '@app/components/add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '@app/components/menu/menu.component';
import { ToolbarComponent } from '@app/components/toolbar/toolbar.component';
import { DisableControlDirective } from '@app/directives/disable-control.directive'
import { HttpClientModule }    from '@angular/common/http';
import { AddSecurityComponent } from '@app/components/add-security/add-security.component';
import { LoginComponent } from './components/login/login.component';
import { AddAssetComponent } from './components/add-asset/add-asset.component';
import { SelectAssetIdComponent } from './components/select-asset-id/select-asset-id.component';
import { SummaryComponent } from './components/summary/summary.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    MenuComponent,
    ToolbarComponent,
    DisableControlDirective,
    AddSecurityComponent,
    LoginComponent,
    AddAssetComponent,
    SelectAssetIdComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialComponentsModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    TooltipModule.forRoot()
  ],
  entryComponents: [
    AddUserComponent,
    AddSecurityComponent,
    LoginComponent,
    AddAssetComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

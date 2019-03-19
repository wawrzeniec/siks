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
import { HistoryGraphComponent } from './components/graphs/history-graph/history-graph.component';
import { GraphContainerComponent } from './components/graphs/graph-container/graph-container.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgComponent } from './components/ng/ng.component';
import { AddAccountComponent } from './components/add-account/add-account.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreakdownGraphComponent } from './components/graphs/breakdown-graph/breakdown-graph.component';
import { SecurityGraphComponent } from './components/graphs/security-graph/security-graph.component';

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
    SummaryComponent,
    HistoryGraphComponent,
    GraphContainerComponent,
    NgComponent,
    AddAccountComponent,
    BreakdownGraphComponent,
    SecurityGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialComponentsModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    TooltipModule.forRoot(),
    NgxChartsModule,
    FontAwesomeModule
  ],
  entryComponents: [
    AddUserComponent,
    AddSecurityComponent,
    LoginComponent,
    AddAssetComponent,
    HistoryGraphComponent,
    AddAccountComponent,
    BreakdownGraphComponent,
    SecurityGraphComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

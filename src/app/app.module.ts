import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialComponentsModule } from './modules/material-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddUserComponent } from './components/add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    MenuComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialComponentsModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  entryComponents: [
    AddUserComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

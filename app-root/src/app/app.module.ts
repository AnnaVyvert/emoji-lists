import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HatComponent } from './components/hat/hat.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { GridComponent } from './pages/grid/grid.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    SideMenuComponent,
    HatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

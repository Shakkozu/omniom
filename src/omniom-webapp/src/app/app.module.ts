import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsModule } from './products/products.module';
import { RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { NgxsModule } from '@ngxs/store';
import { AuthenticationNavbarComponentComponent } from './shared/authentication-navbar-component.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationNavbarComponentComponent,
  ],
  imports: [
    NgxsModule.forRoot([]),
    MaterialModule,
    AuthModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductsModule,
  ],
  exports: [
    MaterialModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

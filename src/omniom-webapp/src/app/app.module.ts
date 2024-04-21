import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsModule } from './products/products.module';
import { RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { NgxsModule } from '@ngxs/store';
import { AuthenticationNavbarComponentComponent } from './shared/authentication-navbar-component.component';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';
import { JwtInterceptor } from './auth/auth.interceptor';
import { UserProfileModule } from './user-profile/user-profile.module';
import { NutritionistModule } from './nutritionist/nutritionist.module';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';

registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationNavbarComponentComponent,
    ErrorDialogComponent
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
    UserProfileModule,
    NutritionistModule
  ],
  exports: [
    MaterialModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pl'},
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxsModule } from '@ngxs/store';
import { AuthorizationState } from './store/authorization.state';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxsModule.forFeature([
      AuthorizationState,
    ]),
    NgxsStoragePluginModule.forRoot({
      key: [AuthorizationState]
    }),
  ]
})
export class AuthModule { }



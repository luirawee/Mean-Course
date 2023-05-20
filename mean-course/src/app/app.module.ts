import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SpinnerComponent } from './spinner/spinner.component';

import { LoadingInterceptor } from './loader/loading.interceptor';
import { AuthInterception } from './auth/auth-interceptor';
import { ErrorInterception } from './error/error.interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    HeaderComponent,
    ErrorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    PostsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterception, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterception, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}

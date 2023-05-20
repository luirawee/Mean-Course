import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterception implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'An unknown error occured!';
        if (error.error.message) message = error.error.message;
        
        this.dialog.open(ErrorComponent, { data: { message: message } });

        return throwError(error);
      })
    );
  }
}

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');

    const authRequest = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' +
          token
      ),
    });
    return next.handle(authRequest);
  }
}

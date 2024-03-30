import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loaderService.show();
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-Auth-Token': 'YOUR-TOKEN-HERE'
      },
    });
    return next.handle(modifiedRequest).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}

import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable, exhaustMap, take } from "rxjs";
import { HttpRequestService } from "./http-request.service";
import { inject } from "@angular/core";

export class HttpInterceptorsService implements HttpInterceptor {
  httpService : HttpRequestService = inject(HttpRequestService);
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('hello inter');
      const modifiedReq = req.clone({params: new HttpParams().set('auth', this.httpService.idToken)})
      return next.handle(modifiedReq)}
  }


import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

import { JWTTokenService } from './jwt';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('id_token') != null) {
            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('id_token'))
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401){
                            localStorage.removeItem('id_token');
                            this.router.navigateByUrl('/user/login');
                        }
                    }
                )
            )
        }
        else
            return next.handle(req.clone());
    }
}
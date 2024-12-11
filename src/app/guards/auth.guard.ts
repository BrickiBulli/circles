import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from, map, Observable, of, retry, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.handleAuth();
  }

  private handleAuth(): Observable<boolean | UrlTree> {
    return from(this.authService.getSession()).pipe(
      switchMap(({ data: { session } }) => {
        if (session?.user) return of(true);
        return this.authService.getCurrentUser().pipe(
          take(1),
          map((user) => {
            if (user) return true;
            return this.router.createUrlTree(['/login']);
          })
        );
      })
    );
  }
}

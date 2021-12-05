import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { LocalAuthService } from '../services/local-auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private localAuthService: LocalAuthService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userRole = this.localAuthService.getAuthUser().role;
    console.log(userRole);
    let roles = next.data.roles as Array<string>;
    console.log(roles);
    if (!roles.includes(userRole)) {
      console.log('user dashboard');
      //this.router.navigate(['/dashboard/overview']);
      return true;
    }else{
      console.log('admin dashboard');
      //this.router.navigate(['/dashboard/admin-overview']);
      return true;
    }

    return true;
  }

}

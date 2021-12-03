import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  private authSource = new BehaviorSubject<User>({ id: '' });
  public user: Observable<User> = this.authSource.asObservable();

  constructor() {
  
  }

  setUser(user: User): boolean {
    if (user !== null) {
      localStorage.setItem('authUser', JSON.stringify(user));
      this.authSource.next(user);
    }
    return true;
  }

  getAuthUser(): User {
    let user = JSON.parse(localStorage.getItem('authUser'));
    return user;
  }

  public signOut(): void {
    localStorage.setItem('authUser',null);
  }
}

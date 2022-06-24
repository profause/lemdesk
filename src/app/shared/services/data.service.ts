import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Department } from '../models/department.interface';
import { ServiceTicket } from '../models/service-ticket.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  updateServiceTicket(serviceTicket: ServiceTicket): Observable<any> {
    return this.httpClient
      .put<any>(
        'http://localhost:3000/service_tickets/' + serviceTicket.id,
        serviceTicket
      )
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: r,
          };
        })
      );
  }

  getServiceTicket(id: string): Observable<any> {
    return this.httpClient
      .get<any>('http://localhost:3000/service_tickets/' + id)
      .pipe(
        switchMap((e) => {
          let result = {
            code: '000',
            message: 'SUCCESS',
            data: e,
          };
          return of(result);
        })
      );
  }
  addServiceTicket(serviceTicket: ServiceTicket): Observable<any> {
    return this.httpClient
      .post<any>('http://localhost:3000/service_tickets', serviceTicket)
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: r,
          };
        })
      );
  }

  deleteServiceTicket(id: string): Observable<any> {
    return this.httpClient
      .delete<any>('http://localhost:3000/service_tickets/' + id)
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: {},
          };
        })
      );
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient
      .delete<any>('http://localhost:3000/users/' + id)
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: {},
          };
        })
      );
  }

  updateUser(user: User): Observable<any> {
    return this.httpClient
      .put<any>('http://localhost:3000/users/' + user.id, user)
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: r,
          };
        })
      );
  }
  addUser(user: User): Observable<any> {
    user['id'] = new Date().getTime().toString();
    return this.httpClient.post<any>('http://localhost:3000/users', user).pipe(
      map((r) => {
        return {
          code: '000',
          message: 'SUCCESS',
          data: r,
        };
      })
    );
  }
  getUserList(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:3000/users').pipe(
      switchMap((e) => {
        let result = {
          code: '000',
          message: 'SUCCESS',
          data: e.map((users) => {
            return {
              ...users,
            };
          }),
        };
        return of(result);
      })
    );
  }

  private listners = new BehaviorSubject('default message');
  private dataSource = new BehaviorSubject('default message');
  public currentdata: Observable<any> = this.dataSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  setData(data) {
    this.dataSource.next(data);
  }

  listen(): Observable<any> {
    return this.listners.asObservable();
  }

  filter(filterBy: string) {
    this.listners.next(filterBy);
  }

  formatAmount(amount): string {
    return parseInt(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  public getServiceTickets() {
    return this.httpClient
      .get<any>('http://localhost:3000/service_tickets')
      .pipe(
        switchMap((e) => {
          let result = {
            code: '000',
            message: 'SUCCESS',
            data: e.map((tickets) => {
              return {
                ...tickets,
              };
            }),
          };
          return of(result);
        })
      );
  }

  deleteDepartment(id: string): Observable<any> {
    return this.httpClient
      .delete<any>('http://localhost:3000/departments/' + id)
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: {},
          };
        })
      );
  }

  updateDepartment(department: Department): Observable<any> {
    return this.httpClient
      .put<any>(
        'http://localhost:3000/departments/' + department.id,
        department
      )
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: r,
          };
        })
      );
  }
  addDepartment(department: Department): Observable<any> {
    department['id'] = new Date().getTime().toString();
    return this.httpClient
      .post<any>('http://localhost:3000/departments', department)
      .pipe(
        map((r) => {
          return {
            code: '000',
            message: 'SUCCESS',
            data: r,
          };
        })
      );
  }
  getDepartmentList(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:3000/departments').pipe(
      switchMap((e) => {
        let result = {
          code: '000',
          message: 'SUCCESS',
          data: e.map((departments) => {
            return {
              ...departments,
            };
          }),
        };
        return of(result);
      })
    );
  }
}

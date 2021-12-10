import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceTicketComponent } from 'src/app/service-management/service-ticket/service-ticket.component';
import { environment } from 'src/environments/environment';
import { Department } from '../models/department.interface';
import { ServiceTicketComment } from '../models/service-ticket-comment.interface';
import { ServiceTicket } from '../models/service-ticket.interface';
import { User } from '../models/user.interface';
import { LocalAuthService } from './local-auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient,
    private localAuth: LocalAuthService,) { }


  public login(user: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    });

    const id = new Date().getTime().toString()
    user.id = id;
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: {
          username: user.username,
          email: 'profaust@gmail.com',
          id: '669c7af378674e086526 ',
          fullname: 'Emmanuel Mensah',
          role: 'RESOLVER',
          department: 'IT OPERATIONS',
          //permissions: [],
          token: 'sometoken'
        }

      }
    )

    return this.httpClient.post<any>(environment.backend.baseUrl + '/users/login', user, {
      headers: httpHeaders,
    });
  }

  public getUserList(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: [
          {
            username: 'profause',
            email: 'profaust@gmail.com',
            id: '669c7af378674e086526 ',
            fullname: 'Emmanuel Mensah',
            role: 'ADMIN',
            department: 'IT OPERATIONS',
          }
        ]
      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/users', {
      headers: httpHeaders,
    });
  }

  public addUser(user: User): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    user.id = id;
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: user

      }
    )

    return this.httpClient.post<any>(environment.backend.baseUrl + '/users/create', user, {
      headers: httpHeaders,
    });
  }

  public updateUser(user: User): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    user.id = id;
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: user

      }
    )

    return this.httpClient.put<any>(environment.backend.baseUrl + '/users/' + user.id, user, {
      headers: httpHeaders,
    });
  }

  public deleteUser(id: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: []
      }
    )

    return this.httpClient.delete<any>(environment.backend.baseUrl + '/users/' + id, {
      headers: httpHeaders,
    });
  }

  public addDepartment(department: Department): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    department.id = id;
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: department
      }
    )

    return this.httpClient.post<any>(environment.backend.baseUrl + '/departments/create', department, {
      headers: httpHeaders,
    });
  }

  public updateDepartment(department: Department): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    department.id = id;
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: department
      }
    )

    return this.httpClient.put<any>(environment.backend.baseUrl + '/departments/' + department.id, department, {
      headers: httpHeaders,
    });
  }

  public deleteDepartment(id: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: []
      }
    )

    return this.httpClient.delete<any>(environment.backend.baseUrl + '/departments/' + id, {
      headers: httpHeaders,
    });
  }

  public getDepartmentList(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: [
          {
            name: 'IT OPERATIONS',
            description: 'IT Operations',
            operations: 'desktop support,user account',
            id: '669c7af378674e086526 ',
          },
          {
            name: 'STUDENT SUPPORT UNIT',
            description: 'Students Support Unit',
            operations: 'students support,general support',
            id: '669c7af377674e086526 ',
          },
          {
            name: 'CASH OFFICE',
            description: 'Cash and fees Operations',
            operations: 'fees operations,general support',
            id: '669c7af308674e086526 ',
          }
          , {
            name: 'EXAMINATION UNIT',
            description: 'Examiniation Operations',
            operations: 'Examination support,general support',
            id: '669c7af379674e086526 ',
          }
        ]
      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/departments', {
      headers: httpHeaders,
    });
  }

  public changePassword(formData: any): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: []
      }
    )

    return this.httpClient.put<any>(environment.backend.baseUrl + '/users/change-password/' + formData.id, formData, {
      headers: httpHeaders,
    });
  }

  public getServiceTicketsAssignedToMe(userId: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: [
          {
            title: 'Service Ticket 1',
            description: 'Service Ticket 1 description',
            id: '669c7af378674e086526 ',
            date: '2019-01-01',
            status: 'OPEN',
            assignedTo: {
              name: 'Emmanuel Mensah',
              id: '669c7af37867086526 ',
            },
            initiator: {
              name: 'John Doe',
              id: '669c7af37867086526 ',
            },
            impact: 'ONLY_ME',
            urgency: 'LOW',
            category: 'GENERAL',
            type: 'REQUEST',
          }
        ]
      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/assigned/' + userId, {
      headers: httpHeaders,
    });
  }

  public getServiceTicketsRecentlyClosed(userId: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: [
          {
            title: 'Service Ticket 1',
            description: 'Service Ticket 1 description',
            id: '669c7af378674e086526 ',
            date: '2019-01-01',
            status: 'CLOSED',
            assignedTo: {
              name: 'Emmanuel Mensah',
              id: '669c7af37867086526 ',
            },
            initiator: {
              name: 'John Doe',
              id: '669c7af37867086526 ',
            },
            impact: 'ONLY_ME',
            urgency: 'LOW',
            category: 'GENERAL',
            type: 'REQUEST',
          }
        ]
      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/recently-closed/' + userId, {
      headers: httpHeaders,
    });
  }

  public getPendingServiceTickets(userId: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: [
          {
            title: 'Service Ticket 1',
            description: 'Service Ticket 1 description',
            id: '669c7af378674e086526 ',
            date: '2019-01-01',
            status: 'PENDING',
            createdBy: '669c7af378674e086526',
            assignedTo: {
              name: 'Emmanuel Mensah',
              id: '669c7af37867086526 ',
            },
            initiator: {
              name: 'John Doe',
              id: '669c7af37867086526 ',
            },
            impact: 'ONLY_ME',
            urgency: 'LOW',
            category: 'GENERAL',
            type: 'REQUEST',
          }
        ]
      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/pending/' + userId, {
      headers: httpHeaders,
    });
  }

  public getServiceCategoryList(): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: [
          'FEES',
          'EXAMINATION',
          'GENERAL',
          'ID CARD'
        ]
      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/categories', {
      headers: httpHeaders,
    });
  }

  public getServiceTicketById(id: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data:
        {
          title: 'Service Ticket 1',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type',
          richTextDescription: '<media type="tweet" url="https://twitter.com/Interior/status/463440424141459456"></media>',
          id: '669c7af378674e086526 ',
          date: '2019-01-01',
          status: 'PENDING',
          createdBy: '669c7af378674e086526',
          assignedTo: {
            name: 'Emmanuel Mensah',
            id: '669c7af37867086526 ',
          },
          initiator: {
            name: 'John Doe',
            id: '669c7af37867086526 ',
          },
          impact: 'ONLY_ME',
          urgency: 'LOW',
          category: 'GENERAL',
          type: 'REQUEST',
        }

      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/' + id, {
      headers: httpHeaders,
    });
  }


  public getServiceTicketComments(serviceTicketId: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: [
          {
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type',
            id: '669c7af378674e086526 ',
            serviceTicketId: '669c7af378674e086526a',
            createdBy: {
              name: 'Emmanuel Mensah',
              id: '669c7af37867086526 ',
            },
            type: 'NOTE',
            createdDate: '2019-01-01',
          },
          {
            text: 'Please provide your student ID',
            id: '669c7af378674e086526 ',
            serviceTicketId: '669c7af378674e086526a',
            createdBy: {
              name: 'Emmanuel Mensah',
              id: '669c7af37867086526 ',
            },
            type: 'COMMENT',
            createdDate: '2019-01-01',
          }, {
            text: 'Kindly contact examination office.',
            id: '669c7af378674e086526 ',
            serviceTicketId: '669c7af378674e086526a',
            createdBy: {
              name: 'Emmanuel Mensah',
              id: '669c7af37867086526 ',
            },
            type: 'COMMENT',
            createdDate: '2019-01-01',
          }
        ]
      }
    )

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/comments/' + serviceTicketId, {
      headers: httpHeaders,
    });
  }

  public addServiceTicket(serviceTicket: ServiceTicket): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    serviceTicket.id = id;
    serviceTicket.createdDate = new Date().getTime().toString();
    serviceTicket.createdBy = this.localAuth.getAuthUser().fullname;
    
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: serviceTicket
      }
    )

    return this.httpClient.post<any>(environment.backend.baseUrl + '/service-tickets', serviceTicket, {
      headers: httpHeaders,
    });
  }

  public updateServiceTicket(serviceTicket: ServiceTicket): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    serviceTicket.id = id;
    serviceTicket.createdDate = new Date().getTime().toString();
    serviceTicket.createdBy = this.localAuth.getAuthUser().fullname;
    
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: serviceTicket
      }
    )

    return this.httpClient.put<any>(environment.backend.baseUrl + '/service-tickets/'+serviceTicket.id, serviceTicket, {
      headers: httpHeaders,
    });
  }

  public addServiceTicketComment(comment: ServiceTicketComment): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    comment.id = id;
    comment.createdDate = new Date().getTime().toString();
    comment.createdBy = this.localAuth.getAuthUser().fullname;
    
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: comment
      }
    )

    return this.httpClient.post<any>(environment.backend.baseUrl + '/service-tickets/comments', comment, {
      headers: httpHeaders,
    });
  }

  public updateServiceTicketComment(comment: ServiceTicketComment): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    const id = new Date().getTime().toString()
    comment.id = id;
    comment.createdDate = new Date().getTime().toString();
    comment.createdBy = this.localAuth.getAuthUser().fullname;
    
    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: comment
      }
    )

    return this.httpClient.put<any>(environment.backend.baseUrl + '/service-tickets/comments/'+comment.id, comment, {
      headers: httpHeaders,
    });
  }

  public deleteServiceTicketComment(id: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return of(
      {
        code: "000",
        message: "SUCCESS",
        data: []
      }
    )

    return this.httpClient.delete<any>(environment.backend.baseUrl + '/service-tickets/comments/' + id, {
      headers: httpHeaders,
    });
  }
}




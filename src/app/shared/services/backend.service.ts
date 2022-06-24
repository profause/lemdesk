import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceTicketComponent } from 'src/app/service-management/service-ticket/service-ticket.component';
import { environment } from 'src/environments/environment';
import { Department } from '../models/department.interface';
import { Feedback } from '../models/feedback.interface';
import { ServiceTicketComment } from '../models/service-ticket-comment.interface';
import { ServiceTicket } from '../models/service-ticket.interface';
import { User } from '../models/user.interface';
import { DataService } from './data.service';
import { LocalAuthService } from './local-auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient,
    private localAuth: LocalAuthService,
    private dataSource: DataService) { }


  public login(user: any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    });

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

    //return this.dataSource.getUserList();

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

    //const id = new Date().getTime().toString()
    //user.id = id;

    //return this.dataSource.addUser(user);

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

    //return this.dataSource.updateUser(user);

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

    //return this.dataSource.deleteUser(id);

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

    return this.httpClient.post<any>(environment.backend.baseUrl + '/departments/create', department, {
      headers: httpHeaders,
    });
  }

  public addFeedback(feedback: Feedback): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return this.httpClient.post<any>(environment.backend.baseUrl + '/feedbacks', feedback, {
      headers: httpHeaders,
    });
  }

  public updateDepartment(department: Department): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return this.httpClient.put<any>(environment.backend.baseUrl + '/departments/' + department.id, department, {
      headers: httpHeaders,
    });
  }

  public updateFeedback(feedback: Feedback): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return this.httpClient.put<any>(environment.backend.baseUrl + '/feedbacks/' + feedback.id, feedback, {
      headers: httpHeaders,
    });
  }

  public deleteDepartment(id: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

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

    //return this.dataSource.getDepartmentList();

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

    // return of(
    //   {
    //     code: "000",
    //     message: "SUCCESS",
    //     data: []
    //   }
    // )

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

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/assignedto/' + userId, {
      headers: httpHeaders,
    });
  }

  public getServiceTicketsInitiatedByMe(userId: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/initiatedby/' + userId, {
      headers: httpHeaders,
    });
  }

  public getServiceTicketsRecentlyClosed(userId: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

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

    return this.httpClient.get<any>(environment.backend.baseUrl + '/service-tickets/' + id, {
      headers: httpHeaders,
    });
  }

  public deleteServiceTicket(id: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

    return this.httpClient.delete<any>(environment.backend.baseUrl + '/service-tickets/' + id, {
      headers: httpHeaders,
    });
  }


  public getServiceTicketComments(serviceTicketId: string): Observable<any> {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + this.localAuth.getAuthUser().token
    });

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

    serviceTicket.date = new Date().getTime().toString();
    serviceTicket.createdBy = this.localAuth.getAuthUser().fullname;

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
    
    console.log(serviceTicket)

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

    comment.createdBy = this.localAuth.getAuthUser().fullname;
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

    return this.httpClient.delete<any>(environment.backend.baseUrl + '/service-tickets/comments/' + id, {
      headers: httpHeaders,
    });
  }
}




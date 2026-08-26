import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InspectorService {
  private apiUrl = environment.apiUrl + '/api/inspectors'; 

  constructor(private http: HttpClient) {}

  getCompanyInspectors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-inspectors`); 
  }

  addInspector(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }
  assignInspector(bookingId: string, inspectorId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/assign`, { bookingId, inspectorId });
  }
  getMyTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks`);
  }
}
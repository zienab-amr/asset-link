import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = environment.apiUrl + '/api/company';

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`).pipe(
      catchError((err) => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};
        
        const realName = user.fullName || user.name;
        const userRole = user.role;
        
        return of({ 
          success: true, 
          data: { 
            companyName: realName, 
            companyRole: userRole 
          } 
        });
      })
    );
  }

  updateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }
  
  getMyAssets() {
    return this.http.get(`${this.baseUrl.replace('company', 'asset')}/my-assets`);
  }
}
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/api/auth';

  constructor(private http: HttpClient) { }

  login(companyEmail: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { companyEmail, password });
  }

  inspectorLogin(inspectorEmail: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/inspector-login`, { inspectorEmail, password });
  }

  register(data: any) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/register-company`,
      data
    );
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post<{ success: boolean; message: string; company?: any }>(
      `${this.baseUrl}/verify-otp`,
      { email, otp }
    );
  }

  resendOtp(email: string) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/resend-otp`,
      { email }
    );
  }

  forgotPassword(email: string) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/forgot-password`,
      { email }
    );
  }

  resetPassword(token: string, password: string) {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.baseUrl}/reset-password/${token}`,
      { password }
    );
  }

  saveSession(token: string, data: any) {
    localStorage.setItem('token', token);
    
    if (data) {
      if (data.role === 'Inspector' || data.inspectorEmail) {
        data.role = 'Inspector';
        localStorage.setItem('user', JSON.stringify(data));
        
        localStorage.removeItem('company'); 
      } 
      else {
        localStorage.setItem('company', JSON.stringify(data)); 
        localStorage.setItem('user', JSON.stringify(data));    
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCompany(): any {
    const companyData = localStorage.getItem('company');
    if (companyData) return JSON.parse(companyData);

    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
    localStorage.removeItem('user'); 
  }
}
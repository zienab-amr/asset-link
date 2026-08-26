import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = ''; 
  password = '';
  rememberMe = true;
  showPassword = false;

  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.handleSuccessfulLogin(res, 'Company');
      },
      error: (err) => {
        this.authService.inspectorLogin(this.email, this.password).subscribe({
          next: (inspRes: any) => {
            this.handleSuccessfulLogin(inspRes, 'Inspector');
          },
          error: (inspErr: any) => {
            this.isLoading = false;
            this.errorMessage = 'Invalid email or password.'; 
          }
        });
      }
    });
  }

  private handleSuccessfulLogin(res: any, roleType: 'Company' | 'Inspector') {
    this.isLoading = false;
    
    const userData = roleType === 'Company' ? res.company : res.inspector;
    
    this.authService.saveSession(res.token, userData);
    
    if (userData.role === 'Inspector') {
      this.router.navigate(['/app/inspections']); 
    } else {
      this.router.navigate(['/app/dashboard']);
    }
  }
}
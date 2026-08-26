import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';

interface SidebarItem {
  title: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  companyName = '';
  companyRole = '';
  companyLogo = '';
  userRole = '';

  platformItems: SidebarItem[] = [
    { title: 'Dashboard', icon: 'layout-dashboard', route: '/app/dashboard' },
    { title: 'Assets', icon: 'boxes', route: '/app/assets/add', badge: 8 },
    { title: 'Smart Matches', icon: 'sparkles', route: '/app/smart-matches', badge: 6 },
    { title: 'Bookings', icon: 'calendar-days', route: '/app/bookings', badge: 3 },
    { title: 'Contracts', icon: 'file-text', route: '/app/contracts' },
    { title: 'Negotiations', icon: 'messages-square', route: '/app/negotiations', badge: 2 },
    { title: 'Delivery', icon: 'truck', route: '/app/delivery-tracking', badge: 1 },
    { title: 'Payments', icon: 'wallet', route: '/app/payments-escrow' },
    { title: 'Inspections', icon: 'clipboard-check', route: '/app/inspections' },
    { title: 'Maintenance', icon: 'wrench', route: '/app/maintenance-schedule' }
  ];

  accountItems: SidebarItem[] = [
    { title: 'Company', icon: 'building-2', route: '/app/company-profile' },
    { title: 'My Inspectors', icon: 'users', route: '/app/inspectors' },
    { title: 'Orders', icon: 'inbox', route: '/app/orders' }
  ];

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      
      // بنسأل سؤال صريح ومباشر بناءً على الـ JSON بتاعك
      if (user.role === 'Inspector') {
        this.userRole = 'Inspector';
        this.companyName = user.fullName; // هيقرا اسمك Zeinab Amr
        this.companyRole = 'Equipment Inspector';
        
        // نخفي القوائم للمفتش
        this.platformItems = [
          { title: 'My Inspections', icon: 'clipboard-check', route: '/app/inspections' }
        ];
        this.accountItems = [];
        return; // بنعمل Return عشان الكود يقف هنا ومايكملش لـ loadProfile
      }
    }

    // لو مش مفتش، هيشتغل كشركة عادي
    this.userRole = 'Company';
    this.loadProfile();
  }

  loadProfile(): void {
    this.companyService.getProfile().subscribe({
      next: (res: any) => {
        const company = res.data;
        this.companyName = company.displayName || company.companyName;
        this.companyRole = company.role || '';
        this.companyLogo = company.companyLogo || '';
      },
      error: (err) => {
        console.error("Failed to load company profile:", err);
      }
    });
  }

  get initials(): string {
    if (!this.companyName) {
      return 'U';
    }
    return this.companyName
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
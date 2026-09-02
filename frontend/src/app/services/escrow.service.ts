import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface EscrowRecord {
  _id: string;
  escrowCode: string;
  bookingId: string;
  contractId: string;
  companyId: any;
  ownerCompanyId: any;
  rentalAmount: number;
  securityDeposit: number;
  totalHeld: number;
  currency: string;
  status: 'Held' | 'Frozen' | 'Released' | 'Refunded' | 'Cancelled';
  rentalReleased?: boolean;
  rentalReleasedAt?: string;
  depositRefunded?: boolean;
  depositRefundedAt?: string;
  depositRefundedAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class EscrowService {
  private apiUrl = environment.apiUrl + '/api/escrow';

  // Bypasses global HTTP interceptors, so a missing escrow (404, before payment
  // happens) does not trigger a generic error popup - same pattern used in
  // damage-report.service.ts
  private httpNoInterceptor: HttpClient;

  constructor(private http: HttpClient, handler: HttpBackend) {
    this.httpNoInterceptor = new HttpClient(handler);
  }

  getEscrowByBooking(bookingId: string): Observable<EscrowRecord | null> {
    return this.httpNoInterceptor.get<any>(`${this.apiUrl}/booking/${bookingId}`).pipe(
      catchError(() => of(null))
    );
  }
}
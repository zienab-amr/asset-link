import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RentalCompletionService {
  private apiUrl = environment.apiUrl + '/api/rental-completion';

  constructor(private http: HttpClient) {}

  returnAsset(bookingId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${bookingId}/return`, {});
  }

  completeRental(bookingId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${bookingId}/complete`, {});
  }
}
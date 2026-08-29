import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreatePenaltyPayload {
  bookingId: string;
  assetId: string;
  damageCost: number;
  damageLevel: string;
}

@Injectable({ providedIn: 'root' })
export class PenaltyService {
  private apiUrl = environment.apiUrl + '/api/penalty';

  constructor(private http: HttpClient) {}

  createPenalty(payload: CreatePenaltyPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, payload);
  }
}
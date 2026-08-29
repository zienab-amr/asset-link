import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface CreateDamageReportPayload {
  inspection: string;
  booking: string;
  damageCost: number;
  damageLevel: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class DamageReportService {
  private apiUrl = environment.apiUrl + '/api/damage-report';

  // http عادي بيمر على الـ Interceptors (بيعرض رسائل خطأ عامة تلقائيًا)
  // httpNoInterceptor بيتجاوزها، مستخدم بس في الحالات اللي الـ 404 فيها طبيعي ومتوقع
  private httpNoInterceptor: HttpClient;

  constructor(private http: HttpClient, handler: HttpBackend) {
    this.httpNoInterceptor = new HttpClient(handler);
  }

  createDamageReport(payload: CreateDamageReportPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, payload);
  }

  // بترجع null بدل ما تعرض رسالة خطأ عامة، لأن 404 هنا معناها "مفيش ضرر مسجل" وده طبيعي
  getDamageReportByBooking(bookingId: string): Observable<any> {
    return this.httpNoInterceptor.get<any>(`${this.apiUrl}/booking/${bookingId}`).pipe(
      catchError(() => of(null))
    );
  }
}
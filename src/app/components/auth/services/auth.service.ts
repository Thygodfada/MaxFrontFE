import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Observable, of, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Vendor } from '../models/vendor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(request : LoginRequest): Observable<LoginResponse>{
   return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/login`, {
      email: request.email,
      password: request.password
    }).pipe(
      tap(response => {
        // Store vendor details in local storage or session storage
        localStorage.setItem('vendor', JSON.stringify(response.id));
      })
    );
  }

  getLoggedInVendor(): Observable<Vendor | null> {
    const vendor = localStorage.getItem('vendor');
    if (vendor) {
      return of(JSON.parse(vendor));
    } else {
      // Handle the case where the vendor is not found
      return of(null);
    }
  }
}

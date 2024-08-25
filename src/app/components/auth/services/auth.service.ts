import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Observable, of, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Vendor } from '../models/vendor';
import * as jwtDecodeModule from 'jwt-decode';

const jwtDecode = jwtDecodeModule.jwtDecode as (token: string) => any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/Auth/login`, {
      email: request.email,
      password: request.password
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); 
      })
    );
  }

  getLoggedInVendor(): Observable<Vendor | null> {
    const token = localStorage.getItem('token');
  
    if (token && token !== "undefined") {
      try {
        // Decode the token to get vendor information
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken); // Log to see the full structure
        const vendorId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        return of({ id: vendorId } as Vendor); // Create a Vendor object from the decoded token
      } catch (error) {
        console.error('Failed to decode token:', error);
        return of(null); // Return null if decoding fails
      }
    } else {
      console.warn('No token found or token is invalid.');
      return of(null); // Return null if token is not found or invalid
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

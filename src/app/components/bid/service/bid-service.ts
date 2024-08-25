import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Adjust path as necessary
import { SubmitBid } from '../models/bid-model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private apiUrl = `${environment.apiBaseUrl}/api/Bid`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBidsByVendor(): Observable<any[]> {
    return new Observable(observer => {
      this.authService.getLoggedInVendor().subscribe(vendor => {
        if (vendor && vendor.id) {
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
          this.http.get<any[]>(`${this.apiUrl}/${vendor.id}`, { headers })
            .subscribe(
              bids => {
                observer.next(bids); // Return all bids without filtering
                observer.complete();
              },
              error => {
                console.error('Failed to fetch bids:', error);
                observer.error(error);
              }
            );
        } else {
          console.error('Vendor ID not found');
          observer.error('Vendor ID not found');
        }
      });
    });
  }
  

  submitBid(bid: SubmitBid): Observable<any> {
    const token = localStorage.getItem('token'); 
    console.log('Token:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.apiUrl, bid, { headers });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Adjust path as necessary
import { SubmitBid } from '../models/bid-model';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private apiUrl = `${environment.apiBaseUrl}/api/bid`;

  constructor(private http: HttpClient) { }

  
  submitBid(bid: SubmitBid): Observable<void> {
    return this.http.post<void>(this.apiUrl, bid);
  }

}

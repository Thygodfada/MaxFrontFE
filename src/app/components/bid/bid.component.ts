import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BidService } from './service/bid-service';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  bids: any[] = []; // Array to hold bids data

  constructor(private bidService: BidService, private router: Router) { }

  ngOnInit(): void {
    this.getSubmittedBids();
  }

  getSubmittedBids(): void {
    this.bidService.getBidsByVendor().subscribe((bids: any[]) => {
      this.bids = bids;
    }, error =>{
      console.error('Failed to fetch bids:', error);
    });
  }

  navigateToBidSubmission(): void {
    this.router.navigate(['/dashboard']);
  }
}

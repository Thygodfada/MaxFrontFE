import { Component, OnInit } from '@angular/core';
import { Project } from './models/project.model';
import { ProjectService } from './services/projectservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BidService } from '../bid/service/bid-service';
import { AuthService } from '../auth/services/auth.service';
import { Observable, switchMap, map, of, combineLatest } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project$: Observable<Project> | undefined;
  bidAmount: number = 0;
  vendorId$: Observable<number | undefined> | undefined;
  bidForm: any;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private bidService: BidService
  ) { }

  ngOnInit(): void {
    // Initialize project$ observable to fetch project details based on route parameter
    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = Number(params.get('id'));
        if (isNaN(projectId)) {
          console.error('Invalid project ID');
          return of(this.createEmptyProject()); // Return an empty project if the ID is invalid
        }
        return this.projectService.getProjectById(projectId).pipe(
          map(project => project || this.createEmptyProject()) // Return an empty project if not found
        );
      })
    );

    // Initialize vendorId$ observable to fetch vendor ID from authService
    this.vendorId$ = this.authService.getLoggedInVendor().pipe(
      map(vendor => vendor ? vendor.id : undefined) // Extract vendorId or set to undefined if vendor is null
    );
  }

  createEmptyProject(): Project {
    // Create a default or empty project as a fallback
    return { id: 0, title: '', description: '' } as Project;
  }

  onSubmitBid() {
    if (this.bidForm.valid) {
      const bidData = this.bidForm.value;
      this.bidService.submitBid(bidData).subscribe(
        response => {
          console.log('Bid submitted successfully:', response);
          // Handle success (e.g., show a success message, navigate, etc.)
        },
        error => {
          console.error('Error submitting bid:', error);
          // Handle error (e.g., show an error message)
        }
      );
    }
  }
}

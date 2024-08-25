import { Component, OnInit } from '@angular/core';
import { Project } from './models/project.model';
import { ProjectService } from './services/projectservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BidService } from '../bid/service/bid-service';
import { AuthService } from '../auth/services/auth.service';
import { Observable, switchMap, map, of, combineLatest } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project$: Observable<Project> | undefined;
  vendorId$: Observable<number | undefined> | undefined;
  bidForm: FormGroup; 

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private bidService: BidService
  ) {
    this.bidForm = new FormGroup({
      vendorId: new FormControl('', Validators.required), 
      projectId: new FormControl('', Validators.required),
      amount: new FormControl(0, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    // Fetch and log project details
    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = Number(params.get('id'));
        if (isNaN(projectId)) {
          console.error('Invalid project ID');
          return of(this.createEmptyProject()); 
        }
        return this.projectService.getProjectById(projectId).pipe(
          map(project => {
            if (project) {
              console.log('Fetched Project:', project); // Log project details
              this.bidForm.get('projectId')?.setValue(project.id);
              return project;
            }
            return this.createEmptyProject(); 
          })
        );
      })
    );

    // Fetch and log vendor ID
    this.vendorId$ = this.authService.getLoggedInVendor().pipe(
      map(vendor => {
        const vendorId = vendor ? vendor.id : undefined;
        console.log('Fetched Vendor ID:', vendorId); // Log vendor ID
        return vendorId;
      })
    );

    // Combine and log vendor ID and project details
    combineLatest([this.vendorId$, this.project$]).subscribe(([vendorId, project]) => {
      console.log('Combined Vendor ID:', vendorId); // Log vendor ID from combineLatest
      console.log('Combined Project:', project); // Log project from combineLatest
      
      if (vendorId) {
        this.bidForm.get('vendorId')?.setValue(vendorId);
      }
      if (project) {
        this.bidForm.get('projectId')?.setValue(project.id);
      }
    });
  }

  createEmptyProject(): Project {
    return { id: 0, title: '', description: '' } as Project;
  }

  onSubmitBid() {
    console.log('Bid Form Submitted');
    console.log('Form Valid:', this.bidForm.valid);
    console.log('Form Values:', this.bidForm.value);
    console.log('Form Errors:', this.bidForm.errors);
    
    if (this.bidForm.valid) {
      if (this.bidForm.valid) {
        const bidData = {
          vendorId: this.bidForm.get('vendorId')?.value,
          projectId: this.bidForm.get('projectId')?.value,
          amount: this.bidForm.get('amount')?.value,
        };
      this.bidService.submitBid(bidData).subscribe({
        next: (response) => {
          console.log('Bid submitted successfully:', response);
          this.router.navigate(['/bids']);
          // Handle success (e.g., show a success message, navigate, etc.)
        },
        error: (error) => {
          console.error('Error submitting bid:', error);
          // Handle error (e.g., show an error message)
        }
      });
    } else {
      console.error('Bid form is invalid');
    }
  }
}
}


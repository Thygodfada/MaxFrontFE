import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project/services/projectservice.service';
import { Project } from '../project/models/project.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
    });
  }
}
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/auth/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectComponent } from './components/project/project.component';
import { AuthGuard } from './components/auth/models/authGuard';
import { BidComponent } from './components/bid/bid.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'project/:id', component: ProjectComponent, canActivate: [AuthGuard]},
  { path: 'bids', component: BidComponent, canActivate: [AuthGuard]}
];


@NgModule({
imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule { }

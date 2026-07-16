import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ProfileService } from '../../../../core/services/profile.service';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../../../core/services/user.service';

interface DashboardStats {
  pending: number;
  published: number;
  developers: number;
  institutions: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboardComponent implements OnInit {
  profile$: Observable<UserProfile | null>;
  stats$: Observable<DashboardStats>;

  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  ) {
    this.profile$ = this.profileService.profile$;
    this.stats$ = this.loadStats().pipe(shareReplay(1));
  }

  ngOnInit(): void {}

  /**
   * Carga las estadísticas combinando diferentes llamadas al servicio
   */
  private loadStats(): Observable<DashboardStats> {
    const pending$ = this.projectService
      .getProjects('pending')
      .pipe(map((projects) => projects.length));

    const published$ = this.projectService
      .getProjects('published')
      .pipe(map((projects) => projects.length));

    const developers$ = this.userService.getDevelopersCount();

    const institutions$ = this.userService.getInstitutionsCount();

    return combineLatest([pending$, published$, developers$, institutions$]).pipe(
      map(([pending, published, developers, institutions]) => ({
        pending,
        published,
        developers,
        institutions,
      }))
    );
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'analisai-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  activeRoute = 'dashboard';

  constructor(private router: Router) {}

  go(route: string) {
    this.activeRoute = route;
    if (route === 'sair') {
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/' + route);
    }
  }
}

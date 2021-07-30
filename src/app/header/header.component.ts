import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() matsideNav: MatSidenav;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }
}

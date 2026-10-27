
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { IUser } from '../../core/models/iposts.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);

  loggedUserData: WritableSignal<IUser | null> = signal(null);

  ngOnInit(): void {
    initFlowbite();

    const userData = localStorage.getItem('socialUer');

    if (userData) {
      try {
        this.loggedUserData.set(JSON.parse(userData) as IUser);
      } catch {
        this.loggedUserData.set(null);
      }
    }
  }

  navbarlogout(): void {
    this.authService.logout();
  }
}

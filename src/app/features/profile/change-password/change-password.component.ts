import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'app-change-password',
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  currentPassword = signal('');
  newPassword = signal('');
  rePassword = signal('');

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  changePassword(): void {
    if (this.loading()) return;

    if (
      !this.currentPassword() ||
      !this.newPassword() ||
      !this.rePassword()
    ) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    if (this.newPassword() !== this.rePassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.userService.changePassword({
      password: this.currentPassword(),
      newPassword: this.newPassword(),
    }).subscribe({
      next: (res) => {
        console.log('Success:', res);
        this.successMessage.set(
          res.message || 'Password changed successfully.'
        );
      },
      error: (err) => {
        console.log('Change password error:', err.status, err.error);
        this.errorMessage.set(
          err.error?.message || 'Failed to change password.'
        );
      },
    });
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  getFieldError,
  isInvalidField,
  patterEmail,
  sweetAlert,
} from '../../func/form-errors';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    SpinnerComponent,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export default class SignInComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  //status variables
  public loading = false;

  // own services
  private auth = inject(AuthService);

  public form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(patterEmail)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    if (this.loading) return;

    if (this.form.invalid) {
      sweetAlert('Uy!', 'El formulario posee errores, echales un vistazo');
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;

    this.auth.loginUser(email!, password!).subscribe({
      next: (_) => {
        this.loading = false;
        this.router.navigate(['/social']);
      },
      error: (e) => {
        sweetAlert('Algo salió mal...', e.error.message);
        this.loading = false;
      },
    });
  }

  invalidField(field: string): boolean | null {
    return isInvalidField(field, this.form);
  }

  getError(field: string): string | null {
    return getFieldError(field, this.form);
  }
}

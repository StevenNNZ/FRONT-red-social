import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  getFieldError,
  isInvalidField,
  patterEmail,
  sweetAlert,
} from '../../func/form-errors';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interface/user-register.interface';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export default class SignUpComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  //status variables
  public loading = false;

  // own services
  private auth = inject(AuthService);

  public form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.pattern(patterEmail)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthDate: ['', [Validators.required]],
  });

  register() {
    if (this.loading) return;

    if (this.form.invalid) {
      sweetAlert('Uy!', 'El formulario posee errores, echales un vistazo');
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value as RegisterRequest;
    this.loading = true;

    this.auth.registerUser(data).subscribe({
      next: (_) => {
        this.loading = false;

        this.router.navigate(['/social']);
      },
      error: (e) => {
        this.loading = false;
        sweetAlert('Algo salió mal...', e.error.message);
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

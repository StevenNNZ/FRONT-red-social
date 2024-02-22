import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, GoogleSigninButtonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export default class SignInComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  validateLogin() {
    this.router.navigate(['/social']);
  }
}

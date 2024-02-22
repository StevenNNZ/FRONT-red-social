import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterModule, GoogleSigninButtonModule],
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export default class SignUpComponent {}

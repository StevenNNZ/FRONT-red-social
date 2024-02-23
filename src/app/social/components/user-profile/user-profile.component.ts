import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { UpdateUserModalComponent } from '../update-user-modal/update-user-modal.component';
import {
  modalUpdateProfileActive,
  modalUpdateProfileData,
} from '../../services/modal-signals';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UpdateUserModalComponent],
  templateUrl: './user-profile.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  // Services
  private auth = inject(AuthService);
  private router = inject(Router);

  // Signals
  public user = computed(this.auth.currentUser);
  public showModal = computed(modalUpdateProfileActive);

  ngOnInit(): void {
    console.log(this.user());
  }

  logOut() {
    this.auth.logOut();
    this.router.navigateByUrl('/');
  }

  getAge(fNacimiento: string): number {
    // Crear un objeto Date con el formato correcto
    const fechaNacimiento = new Date(fNacimiento);

    // Calcular la diferencia en milisegundos entre las dos fechas
    const diferenciaMilisegundos =
      new Date().getTime() - fechaNacimiento.getTime();

    // Convertir la diferencia a días
    const diferenciaDias = Math.floor(
      diferenciaMilisegundos / (1000 * 60 * 60 * 24)
    );

    // Calcular la edad en años
    const edad = Math.floor(diferenciaDias / 365.25);

    // Retornar la edad
    return edad;
  }

  updateProfile() {
    modalUpdateProfileData.set(this.user());
  }
}

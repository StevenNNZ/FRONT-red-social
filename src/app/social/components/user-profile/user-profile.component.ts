import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { UpdateUserModalComponent } from '../update-user-modal/update-user-modal.component';
import {
  modalUpdateProfileActive,
  modalUpdateProfileData,
} from '../../services/modal-signals';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

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
  private userService = inject(UserService);

  // Signals
  public showModal = computed(modalUpdateProfileActive);
  public user = computed(this.userService.user);

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      error: (error) => {
        console.log(error);
      },
    });
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

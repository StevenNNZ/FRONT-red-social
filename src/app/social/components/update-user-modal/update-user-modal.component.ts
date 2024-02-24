import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Observable, fromEvent, map, Subscription } from 'rxjs';
import { modalUpdateProfileData } from '../../func/modal-signals';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  getFieldError,
  isInvalidField,
  patterEmail,
  sweetAlert,
} from '../../../auth/func/form-errors';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserUpdate } from '../../interfaces/user-update.interface';

@Component({
  selector: 'app-update-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user-modal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserModalComponent {
  //servicios
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private auth = inject(AuthService);

  // Observables para cerrar el modal a través del click
  private eventFromDOM: Observable<DOMTokenList> = fromEvent<PointerEvent>(
    document,
    'click'
  ).pipe(map((ev) => (ev.target as HTMLElement).classList));
  private eventFromDOM$?: Subscription;

  //propiedades
  public user = computed(() => modalUpdateProfileData());

  public form = this.fb.group({
    fullName: [
      this.user()?.fullName,
      [Validators.required, Validators.minLength(3)],
    ],
    email: [
      this.user()?.email,
      [Validators.required, Validators.pattern(patterEmail)],
    ],
    password: ['', [Validators.minLength(6)]],
    birthDate: [this.formatDate(this.user()?.birthDate), Validators.required],
  });

  ngOnInit(): void {
    //Nos subscribimos al evento click y capturamos la clase que contiene el elemento
    this.eventFromDOM$ = this.eventFromDOM.subscribe((classList) => {
      if (classList.contains('background-modal')) {
        this.closeModal();
      }
    });
  }

  formatDate(stringDate?: string): string {
    if (!stringDate) return '';

    const date = new Date(stringDate);

    // Obtener los componentes de la fecha
    const año = date.getFullYear();
    const mes = ('0' + (date.getMonth() + 1)).slice(-2); // Sumar 1 al mes ya que los meses en JavaScript son base 0
    const dia = ('0' + date.getDate()).slice(-2);

    // Crear una cadena en el formato yyyy-mm-dd
    return `${año}-${mes}-${dia}`;
  }

  ngOnDestroy(): void {
    //eliminamos el evento activo
    this.eventFromDOM$?.unsubscribe();
  }

  updateUser() {
    if (!this.user()?._id) {
      this.closeModal();
      sweetAlert('Oops', 'Ocurrió un problema, por favor vuelve a intentarlo');
    }

    if (this.form.invalid) {
      sweetAlert('Uy!', 'El formulario posee errores, echales un vistazo');
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value as UserUpdate;
    this.userService.updateUser(this.user()!._id, data).subscribe({
      next: (user) => {
        this.auth.setUser(user);
        sweetAlert(
          '¡Enhorabuena!',
          'Se ha actualizado tu información correctamente'
        );
        this.closeModal();
      },
      error: (e) => {
        if (e.status === 400) {
          if (e.error.message instanceof Array) {
            sweetAlert('Oops', e.error.message[0]);
            return;
          }

          sweetAlert('¡Oops! ', e.error.message);
          return;
        }

        if (e.status !== 401) {
          sweetAlert('¡Oops!', e.message);
        }
      },
    });

    return;

    //emitimos una señal para cerrar el modal
  }

  closeModal() {
    modalUpdateProfileData.set(undefined);
  }

  //validar campo de formulario
  invalidField(field: string): boolean | null {
    return isInvalidField(field, this.form);
  }

  //traer errores de campo del formulario
  getError(field: string): string | null {
    return getFieldError(field, this.form);
  }
}

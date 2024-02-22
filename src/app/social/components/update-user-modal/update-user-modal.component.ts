import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Observable, fromEvent, map, Subscription } from 'rxjs';
import { modalUpdateProfileData } from '../../services/modal-signals';

@Component({
  selector: 'app-update-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './update-user-modal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserModalComponent {
  // Observables para manejar el click del usuario
  private eventFromDOM: Observable<DOMTokenList> = fromEvent<PointerEvent>(
    document,
    'click'
  ).pipe(map((ev) => (ev.target as HTMLElement).classList));
  private eventFromDOM$?: Subscription;

  //propiedades
  public user = computed(() => modalUpdateProfileData());

  ngOnInit(): void {
    //Nos subscribimos al evento click y capturamos la clase que contiene el elemento
    this.eventFromDOM$ = this.eventFromDOM.subscribe((classList) => {
      if (classList.contains('background-modal')) {
        modalUpdateProfileData.set(undefined);
      }
    });
  }

  imprimir(e: Event) {
    console.log((e.target as HTMLInputElement).value);
  }
  ngOnDestroy(): void {
    //eliminamos el evento activo
    this.eventFromDOM$?.unsubscribe();
  }

  closeModal() {
    //emitimos una señal para cerrar el modal
    modalUpdateProfileData.set(undefined);
  }
}

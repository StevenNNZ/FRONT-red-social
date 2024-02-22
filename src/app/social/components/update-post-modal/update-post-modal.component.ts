import { Component, computed } from '@angular/core';
import { Observable, Subscription, fromEvent, map } from 'rxjs';
import { modalUpdatePostData } from '../../services/modal-signals';

@Component({
  selector: 'app-update-post-modal',
  standalone: true,
  imports: [],
  templateUrl: './update-post-modal.component.html',
  styles: ``,
})
export class UpdatePostModalComponent {
  // Observables para manejar el click del usuario
  private eventFromDOM: Observable<DOMTokenList> = fromEvent<PointerEvent>(
    document,
    'click'
  ).pipe(map((ev) => (ev.target as HTMLElement).classList));
  private eventFromDOM$?: Subscription;

  //propiedades
  public post = computed(() => modalUpdatePostData());
  ngOnInit(): void {
    //Nos subscribimos al evento click y capturamos la clase que contiene el elemento
    this.eventFromDOM$ = this.eventFromDOM.subscribe((classList) => {
      if (classList.contains('background-modal')) {
        modalUpdatePostData.set(undefined);
      }
    });
  }

  ngOnDestroy(): void {
    //eliminamos el evento activo
    this.eventFromDOM$?.unsubscribe();
  }

  closeModal() {
    //emitimos una señal para cerrar el modal
    modalUpdatePostData.set(undefined);
  }
}

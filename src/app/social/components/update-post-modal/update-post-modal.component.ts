import { Component, computed, inject } from '@angular/core';
import { Observable, Subscription, fromEvent, map } from 'rxjs';
import { modalUpdatePostData } from '../../func/modal-signals';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import {
  sweetAlert,
  isInvalidField,
  getFieldError,
} from '../../../auth/func/form-errors';
import { UpdatePost } from '../../interfaces/post.interface';

@Component({
  selector: 'app-update-post-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-post-modal.component.html',
  styles: ``,
})
export class UpdatePostModalComponent {
  //servicios
  private fb = inject(FormBuilder);
  private postService = inject(PostService);

  // Observables para manejar el click del usuario
  private eventFromDOM: Observable<DOMTokenList> = fromEvent<PointerEvent>(
    document,
    'click'
  ).pipe(map((ev) => (ev.target as HTMLElement).classList));
  private eventFromDOM$?: Subscription;

  //propiedades
  public post = computed(() => modalUpdatePostData());

  //data
  public form = this.fb.group({
    title: [this.post()?.title, [Validators.required, Validators.minLength(3)]],
    content: [
      this.post()?.content,
      [Validators.required, Validators.maxLength(260)],
    ],
  });

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

  updateUser() {
    if (!this.post()?.userId) {
      this.closeModal();
      sweetAlert('Oops', 'Ocurrió un problema, por favor vuelve a intentarlo');
    }

    if (this.form.invalid) {
      sweetAlert('Uy!', 'El formulario posee errores, echales un vistazo');
      this.form.markAllAsTouched();
      return;
    }

    const data: UpdatePost = {
      title: this.form.value.title!,
      content: this.form.value.content!,
    };
    this.postService.updatePost(this.post()!._id, data).subscribe({
      next: () => {
        sweetAlert('¡Hecho!', 'Se ha actualizado correctamente tu post');
        this.closeModal();
      },
      error: (e) => {
        if (e.status !== 401) {
          sweetAlert('¡Oops!', e.message);
        }
      },
    });
  }

  closeModal() {
    //emitimos una señal para cerrar el modal
    modalUpdatePostData.set(undefined);
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

import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import {
  isInvalidField,
  getFieldError,
  sweetAlert,
} from '../../../auth/func/form-errors';
import { PostService } from '../../services/post.service';
import { CreatePost } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post-section',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-section.component.html',
  styles: ``,
})
export class PostSectionComponent {
  // services
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private postService = inject(PostService);

  public user = computed(() => this.auth.currentUser());

  public form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.maxLength(260)]],
  });

  submit() {
    if (!this.user()?._id) {
      sweetAlert('Oops', 'Ocurrió un problema, por favor vuelve a intentarlo');
    }

    if (this.form.invalid) {
      sweetAlert('Uy!', 'El formulario posee errores, echales un vistazo');
      this.form.markAllAsTouched();
      return;
    }

    const data: CreatePost = {
      userId: this.user()!._id,
      title: this.form.value.title!,
      content: this.form.value.content!,
    };

    this.postService.createPost(data).subscribe({
      next: () => {
        sweetAlert('¡Hecho!', 'Has publicado correctamente tu contenido');
        this.form.reset();
      },
      error: (e) => {
        if (e.status !== 401) {
          sweetAlert('¡Oops!', e.message);
        }
      },
    });
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

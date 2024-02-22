import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { UpdatePostModalComponent } from '../update-post-modal/update-post-modal.component';
import {
  modalUpdatePostActive,
  modalUpdatePostData,
  modalUpdateProfileActive,
} from '../../services/modal-signals';

@Component({
  selector: 'app-wall',
  standalone: true,
  imports: [CommonModule, UpdatePostModalComponent],
  templateUrl: './wall.component.html',
  styles: ``,
})
export default class WallComponent implements OnInit {
  public posts = signal<Post[]>([]);
  public showModal = computed(modalUpdatePostActive);
  public modalsOpen = computed(() => {
    if (modalUpdatePostActive()) return true;
    if (modalUpdateProfileActive()) return true;
    return false;
  });
  ngOnInit(): void {
    this.posts.set([
      {
        id: 1,
        nombre_user: 'John Doe',
        fecha_publicacion: '2024-02-22',
        titulo: 'This is my first post!',
        descripcion: 'A short description about my first post.',
        likes: 10,
      },
      {
        id: 2,
        nombre_user: 'Jane Smith',
        fecha_publicacion: '2024-02-21',
        titulo: 'Sharing my thoughts on...',
        descripcion: 'Here are my thoughts on a particular topic.',
        likes: 25,
      },
      {
        id: 3,
        nombre_user: 'Carlos Rodríguez',
        fecha_publicacion: '2024-02-16',
        titulo: 'Análisis de la actualidad política',
        descripcion: 'Mi opinión sobre los eventos políticos recientes.',
        likes: 40,
      },
      {
        id: 4,
        nombre_user: 'Sofia Gómez',
        fecha_publicacion: '2024-02-15',
        titulo: 'Reseña del nuevo libro de...',
        descripcion: 'Mi opinión sobre el último libro de un autor famoso.',
        likes: 65,
      },
      {
        id: 5,
        nombre_user: 'David Herrera',
        fecha_publicacion: '2024-02-14',
        titulo: 'Tutorial para principiantes en React',
        descripcion: 'Guía para aprender los fundamentos de ReactJS.',
        likes: 90,
      },
      {
        id: 7,
        nombre_user: 'Isabel Santos',
        fecha_publicacion: '2024-02-13',
        titulo: 'Mi experiencia aprendiendo TypeScript',
        descripcion:
          'Comparto los desafíos y beneficios de aprender este lenguaje.',
        likes: 70,
      },
      {
        id: 8,
        nombre_user: 'Miguel Díaz',
        fecha_publicacion: '2024-02-12',
        titulo: 'Fotografías de mi viaje a la naturaleza',
        descripcion:
          'Comparto las fotos que tomé en mi última aventura al aire libre.',
        likes: 120,
      },
    ]);
  }

  editPost(post: Post) {
    modalUpdatePostData.set(post);
  }

  deletePost(id: number) {
    this.posts.update((posts) => posts.filter((post) => post.id !== id));
  }

  onToggleMenu(dropdown: HTMLDivElement) {
    if (dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
    } else {
      dropdown.classList.add('hidden');
    }
  }

  closeDropDown(dropdown: HTMLDivElement) {
    if (!dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
    }
  }
}

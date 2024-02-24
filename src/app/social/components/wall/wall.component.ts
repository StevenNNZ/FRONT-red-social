import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { UpdatePostModalComponent } from '../update-post-modal/update-post-modal.component';
import {
  modalUpdatePostActive,
  modalUpdatePostData,
  modalUpdateProfileActive,
} from '../../func/modal-signals';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../auth/services/auth.service';
import { sweetAlert } from '../../../auth/func/form-errors';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-wall',
  standalone: true,
  imports: [CommonModule, UpdatePostModalComponent, SpinnerComponent],
  templateUrl: './wall.component.html',
  styles: ``,
})
export default class WallComponent implements OnInit {
  //services
  private postService = inject(PostService);
  private auth = inject(AuthService);

  //Signal data
  public posts = this.postService.posts();
  public user = this.auth.currentUser();
  public showModal = computed(modalUpdatePostActive);

  //status variables
  public loading = true;

  //Ocultar acciones si hay un modal
  public modalsOpen = computed(() => {
    if (modalUpdatePostActive()) return true;
    if (modalUpdateProfileActive()) return true;
    return false;
  });

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (e) => {
        if (e.status !== 401) {
          sweetAlert('¡Oops!', e.message);
          this.loading = false;
        }
      },
    });
  }

  editPost(post: Post) {
    modalUpdatePostData.set(post);
  }

  likePost(id: string) {
    this.postService.likePost(id).subscribe({
      error: (e) => {
        if (e.status !== 401) {
          sweetAlert('¡Oops!', e.message);
        }
      },
    });
  }

  deletePost(id: string) {
    this.postService.deletePost(id).subscribe({
      next: () =>
        sweetAlert('¡Hecho!', 'se ha eliminado el post de forma correcta'),
      error: (e) => {
        if (e.status !== 401) {
          sweetAlert('¡Oops!', e.message);
        }
      },
    });
    // this.posts.update((posts) => posts.filter((post) => post.id !== id));
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

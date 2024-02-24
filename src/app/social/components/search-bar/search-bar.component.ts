import { Component, inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { sweetAlert } from '../../../auth/func/form-errors';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styles: ``,
})
export class SearchBarComponent {
  private postService = inject(PostService);

  filterPosts(term: string) {
    this.postService.getPostsByTerm(term).subscribe({
      error: (e) => {
        if (e.status !== 401) {
          sweetAlert('¡Oops!', e.message);
        }
      },
    });
  }
}

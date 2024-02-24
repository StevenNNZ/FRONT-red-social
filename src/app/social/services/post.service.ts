import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { CreatePost, Post, UpdatePost } from '../interfaces/post.interface';

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  //signals data
  private _posts = signal<Post[]>([]);
  private _backup_posts = signal<Post[]>([]);
  public posts = computed(() => this._posts);

  getPosts(): Observable<boolean> {
    return this.http.get<Post[]>(`${this.apiUrl}/post`).pipe(
      tap((posts) => this._posts.set(posts)),
      map((_) => true)
    );
  }

  createPost(data: CreatePost): Observable<boolean> {
    return this.http.post<Post>(`${this.apiUrl}/post`, data).pipe(
      tap((post) => this._posts.update((posts) => [post, ...posts])),
      map(() => true)
    );
  }

  updatePost(id: string, data: UpdatePost): Observable<Boolean> {
    return this.http.patch<Post>(`${this.apiUrl}/post/${id}`, data).pipe(
      tap((post) => this.updateSignalPost(post)),
      map((_) => true)
    );
  }

  likePost(id: string): Observable<Boolean> {
    return this.http.patch<Post>(`${this.apiUrl}/post/like/${id}`, {}).pipe(
      tap((post) => this.updateSignalPost(post)),
      map((_) => true)
    );
  }

  deletePost(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/post/${id}`).pipe(
      tap(() =>
        this._posts.update((posts) => {
          return posts.filter((post) => post._id !== id);
        })
      ),
      map(() => true)
    );
  }

  getPostsByTerm(term: string): Observable<boolean> {
    if (!term) return of(true);

    return this.http.get<Post[]>(`${this.apiUrl}/post/filter/${term}`).pipe(
      tap((posts) => this._posts.set(posts)),
      map((_) => true)
    );
  }

  private updateSignalPost(post: Post) {
    this._posts.update((posts) => {
      return posts.map((p) => {
        if (post._id == p._id) return post;

        return p;
      });
    });
  }
}

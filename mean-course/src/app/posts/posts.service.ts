import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPost } from '../models/post.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: IPost[] = [];
  private postsUpdated = new Subject<{ data: IPost[]; total: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    let queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{ data: IPost[]; total: number }>(
        `${environment.apiUrl}/posts${queryParams}`
      )
      .pipe(
        map((res) => {
          return {
            data: res.data.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                id: post._id,
                creator: post.creator,
              };
            }),
            total: res.total,
          };
        })
      )
      .subscribe((data) => {
        this.posts = data.data;
        this.postsUpdated.next({ data: this.posts, total: data.total });
        this.router.navigate(['/']);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<IPost>(`${environment.apiUrl}/posts/${postId}`);
  }
  addPost(post: FormData) {
    return this.http.post<IPost>(`${environment.apiUrl}/posts`, post);
  }

  updatePost(postId: string, post: IPost | FormData) {
    return this.http.put<IPost>(`${environment.apiUrl}/posts/${postId}`, post);
  }

  deletePost(postId: string, postsPerPage: number, currentPage: number) {
    this.http.delete(`${environment.apiUrl}/posts/${postId}`).subscribe(() => {
      this.getPosts(postsPerPage, currentPage);
    });
  }
}

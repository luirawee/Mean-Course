import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IPost } from 'src/app/models/post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: IPost[] = [];
  postsSub!: Subscription;
  totalPosts: number = 0;
  postsPerPage: number = 5;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1, 5, 10, 20, 50, 100];
  userId: string | null | undefined;

  private authListenerSubs!: Subscription;
  userIsAuthenticated: boolean = false;

  constructor(
    public postsService: PostsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();

    this.userId = this.authService.getUserId();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.userIsAuthenticated = isAuth;
      });

    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((_data: { data: IPost[]; total: number }) => {
        this.posts = _data.data;
        this.totalPosts = _data.total;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId, this.postsPerPage, this.currentPage);
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}

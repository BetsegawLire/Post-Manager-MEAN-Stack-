import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  // posts = [
  //   {
  //     title: "First Post",
  //     content: "First post content"
  //   },
  //   {
  //     title: "Second Post",
  //     content: "Second post content"
  //   },
  //   {
  //     title: "Third Post",
  //     content: "Third post content"
  //   }
  // ]

  isLoading = false

  posts: Post[] = []
  private postsSub: Subscription | undefined

  authStatusSubs!: Subscription;
  userIsAuthenticated = false 
  

  constructor(public postService: PostsService, private authService: AuthService) {}
  ngOnDestroy(): void {
   this.postsSub?.unsubscribe()
   this.authStatusSubs.unsubscribe()
  }
  ngOnInit(): void {
    this.isLoading = true
    this.postService.getPosts()
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false
      this.posts = posts
    })
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authStatusSubs =  this.authService.getAuthStatusListner()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    })
  }

  onDelete(postId: any) {
    this.postService.deletePost(postId)
  }

}

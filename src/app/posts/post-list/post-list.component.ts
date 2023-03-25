import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'

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

  posts: Post[] = []
  private postsSub: Subscription | undefined
  

  constructor(public postService: PostsService) {}
  ngOnDestroy(): void {
   this.postsSub?.unsubscribe()
  }
  ngOnInit(): void {
    this.postService.getPost()
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts
    })
  }

}

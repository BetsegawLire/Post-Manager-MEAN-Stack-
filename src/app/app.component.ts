import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
   this.authService.autoAuthUser()
  }
  title = 'firs_node_server_with_angular';

  posts: Post[] = []

  onPostAdded(post: Post) {
    this.posts.push(post)
  }
}

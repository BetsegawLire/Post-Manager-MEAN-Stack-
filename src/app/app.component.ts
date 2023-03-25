import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firs_node_server_with_angular';

  posts: Post[] = []

  onPostAdded(post: Post) {
    this.posts.push(post)
  }
}

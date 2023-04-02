import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  // safeUrl: any;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
   this.authService.autoAuthUser()
  //  this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/watch?v=zcAalMeaKso")
  }
  title = 'firs_node_server_with_angular';

  posts: Post[] = []

  onPostAdded(post: Post) {
    this.posts.push(post)
  }
}

import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts
      this.postsUpdated.next([...this.posts])
    })
  }

 

  getPostUpdateListener() {
    return this.postsUpdated.asObservable()
  }

  getPost(id: any) {
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id)
  }
  

  addpost(title: string, content: string) {
    const post: Post = {
      id: '',
      title: title,
      content: content
    
    }
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((res) => {
      console.log(res.message)
      const postId = res.postId
      post.id = postId
      this.posts.push(post)
      this.postsUpdated.next([...this.posts])
      this.router.navigate(['/'])
    })
  }

  updatePost(id: string, title:string, content: string) {
    const post: Post = {id: id, title: title, content: content}
    this.http.put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(response => {
      console.log(response)
      this.router.navigate(['/'])
    })
  }

  deletePost(postId: any) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      console.log(`Deleted`)
      const updatePosts = this.posts.filter(post => post.id !== postId)
      this.posts = updatePosts
      this.postsUpdated.next([...this.posts])
    }, () => {
      console.log("something went wrong")
    })
  }
}

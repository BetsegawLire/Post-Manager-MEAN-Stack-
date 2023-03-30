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
      return postData.posts.map((post: { title: any; content: any; _id: any; imagePath: any}) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id)
  }
  

  addpost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title)
    postData.append("content", content)
    postData.append("image", image, title)
    
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((res) => {
      const post: Post = {
        id: res.post.id,
        title: title,
        content: content,
        imagePath: res.post.imagePath
      }
      // console.log(res.message)
      // const postId = res.postId
      // post.id = postId
      this.posts.push(post)
      this.postsUpdated.next([...this.posts])
      this.router.navigate(['/'])
    })
  }

  updatePost(id: string, title:string, content: string, image: any) {
    let postData: FormData | Post  
    if(typeof(image) === "object") {
        postData = new FormData()
        postData.append("id", id)
        postData.append("title", title)
        postData.append("content", content)
        postData.append("image", image, title)
      }else {
        postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image
        }
      }
    // const post: Post = {id: id, title: title, content: content, imagePath: null}
    this.http.put("http://localhost:3000/api/posts/" + id, postData)
    .subscribe(response => {
      const updatedPosts = [...this.posts]
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id)
      const post: Post = {
        id: id,
          title: title,
          content: content,
          imagePath: ""
      } 
      updatedPosts[oldPostIndex] =  post
      this.posts = updatedPosts
      this.postsUpdated.next([...this.posts])
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

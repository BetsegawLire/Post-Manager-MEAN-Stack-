import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {

  newPost = "No Content"
  enteredTitle = '';
  enteredContent = ''


  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    // alert("Post added!")
    // this.newPost = this.entered
    if(form.invalid) {
      return
    }
    this.postsService.addpost(form.value.title, form.value.content)
    form.resetForm();
  }
}



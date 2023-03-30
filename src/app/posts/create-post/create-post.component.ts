import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  newPost = 'No Content';
  enteredTitle = '';
  enteredContent = '';

  form!: FormGroup;

  isLoading = false;

  mode = 'create';
  private postId!: any;
  post: any;

  imagePreview: any;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      
      image: new FormControl(null,{ validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form?.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onAddPost() {
    // alert("Post added!")
    // this.newPost = this.entered
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addpost(
        this.form?.value.title,
        this.form?.value.content,
        this.form?.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form?.value.title,
        this.form?.value.content,
        this.form.value.image
      );
    }
    this.form?.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    this.form.patchValue({
      image: file
    });
    this.form.get('image')?.updateValueAndValidity()
    const reader: any = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
    console.log(file)
    console.log(this.imagePreview)
  }
}

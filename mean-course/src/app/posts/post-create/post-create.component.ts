import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IPost } from 'src/app/models/post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode = 'Create';
  private postId?: string | null;
  post?: IPost | null;
  form!: FormGroup;
  imagePreview!: string | ArrayBuffer | Blob;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'Edit';
        this.postId = paramMap.get('postId')!;
        this.postsService.getPost(this.postId).subscribe((result: any) => {
          this.post = result;
          this.form.setValue({
            id: this.postId,
            title: this.post?.title,
            content: this.post?.content,
            image: this.post?.imagePath,
          });
        });
      } else {
        this.mode = 'Create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    // if (this.form.invalid) return;

    if (this.mode === 'Create') {
      const postData = new FormData();
      postData.append('title', this.form.value.title);
      postData.append('content', this.form.value.content);
      postData.append('image', this.form.value.image, this.form.value.title);

      this.postsService.addPost(postData).subscribe(
        () => {
          // this.form.reset();
          this.router.navigate(['/']);
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      let postData: IPost | FormData;
      if (typeof this.form.value.image === 'object') {
        postData = new FormData();
        postData.append('id', this.form.value.id);
        postData.append('title', this.form.value.title);
        postData.append('content', this.form.value.content);
        postData.append('image', this.form.value.image, this.form.value.title);
      } else {
        postData = {
          id: this.form.value.id,
          title: this.form.value.title,
          content: this.form.value.content,
          imagePath: this.form.value.image,
        };
      }

      this.postsService.updatePost(this.form.value.id, postData).subscribe(
        () => {
          this.router.navigate(['edit/' + this.form.value.id]);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  onImagePicked(e: Event) {
    const file = (e.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result!;
    };
    reader.readAsDataURL(file);
  }
}

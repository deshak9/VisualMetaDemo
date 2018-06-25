import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PostService} from "../services/post.service";
import {Post} from "../shared/models/post";
import {AlertService} from "../shared/services/alert.service";
import {RouteConstant} from "../shared/constants/route.contants";

@Component({
  templateUrl: 'write-post.component.html',
  styleUrls: ['write-post.component.scss']
})

export class WritePostComponent implements OnInit {
  newPost: FormGroup;
  submitted = false;
  loading = false;
  titleMaxLength = 100;
  contentMaxLength = 2000;

  constructor(private formBuilder: FormBuilder, private router: Router, private postService: PostService, private alertService: AlertService) {

  }

  ngOnInit() {
    this.newPost = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(this.titleMaxLength - 1)]],
      content: ['', [Validators.required, Validators.maxLength(this.contentMaxLength - 1)]]
    });
  }

  get f() {
    return this.newPost.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newPost.invalid) {
      return;
    }

    this.loading = true;

    let post: Post = new Post();
    post.title = this.f.title.value;
    post.content = this.f.content.value;
    post.createDate = Date.now();
    this.postService.addPost(post).subscribe(
      res => {
        if (res.success) {
          this.router.navigate([RouteConstant.HOME]);
        } else {
          this.alertService.error(res.description, false, 3000)
        }
        this.loading = false;
      },
      err => {
        this.alertService.error(err, false, 3000)
        this.loading = false;
      }
    );
  }
}
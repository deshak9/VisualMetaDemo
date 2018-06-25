import {Component, OnDestroy, OnInit} from '@angular/core';

import {Post} from '../shared/models';
import {PostService} from "../services/post.service";
import {AlertService} from "../shared/services/alert.service";
import {RouteConstant} from "../shared/constants/route.contants";

@Component({templateUrl: 'home.component.html', styleUrls: ['home.component.scss']})
export class HomeComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = false;
  isError = false;
  newPostLink = RouteConstant.NEW_POST;
  postSubs: any;
  deletePostSubs: any;

  constructor(private postService: PostService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.isError = false;
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.postSubs && this.postSubs.unsubscribe();
    this.deletePostSubs && this.deletePostSubs.unsubscribe();
  }

  /**
   * get current user's posts
   */
  loadPosts() {
    this.loading = true;
    this.postSubs = this.postService.getPosts().subscribe(res => {
      if (res.success) {
        this.posts = res.response;
      }
      this.loading = false;
    }, err => {
      this.alertService.error(`${err}, please refresh the page`, false);
      this.loading = false;
      this.isError = true;
    });
  }

  /**
   * delete post by id
   * @param post
   */
  deletePost(post) {
    this.deletePostSubs = this.postService.deletePost(post.id).subscribe(res => {
      if (res.success) {
        this.loadPosts();
      } else {
        this.alertService.error(res.description, false, 3000);
        post.isDeleting = false;
      }
    }, err => {
      this.alertService.error(`${err}, Could not delete the post`, false, 3000);
      post.isDeleting = false;
    });
  }
}
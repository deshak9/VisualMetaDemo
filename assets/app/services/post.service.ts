import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Post} from "../shared/models/post";

@Injectable()
export class PostService {
  constructor(private http: HttpClient) {
  }

  addPost(post: Post) {
    return this.http.post<any>(`api/posts`, post);
  }

  getPosts() {
    return this.http.get<any>(`api/posts`);
  }

  deletePost(id) {
    return this.http.delete<any>(`api/posts/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get(this.postsUrl);
  }

  createPost(postData: any) {
    return this.http.post(this.postsUrl, postData);
  }

  updatePost(postId: string, postData: any) {
    const url = `${this.postsUrl}/${postId}`;
    return this.http.put(url, postData);
  }

  deletePost(postId: string) {
    const url = `${this.postsUrl}/${postId}`;
    return this.http.delete(url);
  }
}

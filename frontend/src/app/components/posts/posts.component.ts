import { Component } from '@angular/core';
import { PostsService } from 'src/services/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
posts:any[] = [];
constructor(private postsService: PostsService) { }

ngOnInit() {
  this.getPosts();
}

getPosts(){
  this.postsService.getPosts().subscribe((posts:any) => {
    this.posts = posts;
  });
}

createPost() {
  const postData = { title: 'New Post', body: 'This is the content of the new post.' };
  this.postsService.createPost(postData).subscribe((newPost:any) => {
    this.posts.push(newPost);
  });
}
}

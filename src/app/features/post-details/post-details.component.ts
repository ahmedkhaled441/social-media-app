import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../shared/services/posts/posts.service';
import { Iposts } from '../../core/models/iposts.interface';

@Component({
  selector: 'app-post-details',
  imports: [],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent {
  private readonly activatedRoute=inject(ActivatedRoute)
  private readonly postsService=inject(PostsService)
  postData:WritableSignal<Iposts>= signal({} as Iposts)


  postId=signal('')
  ngOnInit():void{
    this.readUrl()
  }
  readUrl(){
    this.activatedRoute.paramMap.subscribe({
      next:(res)=>{
        console.log(res.get('id'));
        this.postId.set(res.get('id')!)
        this.getPostDetails()
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  getPostDetails(){
    this.postsService.getSinglePost(this.postId()).subscribe({
      next:(res)=>{
        console.log(res.data.post);
        this.postData.set(res.data.post)
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}

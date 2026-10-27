import { Component, inject, OnInit, signal, WritableSignal, input } from '@angular/core';
import { PostsService } from '../../../../../shared/services/posts/posts.service';
import { Iposts, IUser } from '../../../../../core/models/iposts.interface';
import { CommentsComponent } from '../comments/comments.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-center-content',
  imports: [CommentsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './center-content.component.html',
  styleUrl: './center-content.component.css',
})
export class CenterContentComponent implements OnInit{
  private readonly postsService=inject(PostsService)

  private readonly spinner=inject(NgxSpinnerService)

  private readonly toastr = inject(ToastrService);

  currentPage=signal(1)
  totalPages=signal(1)
  allPosts:WritableSignal<Iposts[]>=signal([])
  loggedUserData:WritableSignal<IUser>= signal({} as IUser)
  imgFile!:File
  imgUrl=signal<string|ArrayBuffer|null|undefined>('')
  PostBody:FormControl=new FormControl()
  PostPrivacy:FormControl=new FormControl('public')
  ngOnInit(): void {
    this.getAllPosts()
    this.saveUserData()
  }
  getAllPosts(page:number=1){
    this.spinner.show()
    this.postsService.getAllPosts(page).subscribe({
      next:(res)=>{
        console.log(res.data.posts);
        this.allPosts.set(res.data.posts)
        this.currentPage.set(res.meta.pagination.currentPage)
        this.totalPages.set(res.meta.pagination.numberOfPages)
        this.spinner.hide()
      },
      error:(err)=>{
        console.log(err);
        this.toastr.error(err.error.message, 'Error ')
        this.spinner.hide()

      }
    })
  }
  nextPage(){
    if (this.currentPage() < this.totalPages()) {
    this.getAllPosts(this.currentPage()+1)
  }}
  previousPage(){
    if (this.currentPage() > 1) {
      this.getAllPosts(this.currentPage()-1)
    }}

    saveUserData(){
      this.loggedUserData.set(JSON.parse(localStorage.getItem('socialUer')!))
      console.log(this.loggedUserData());

    }

preparedUploadedFile(e:Event){
  let input=e.target as HTMLInputElement
if(input){
if(input.files){
  this.imgFile=input.files[0]
  console.log(this.imgFile);
  this.readFile()
}
}}
readFile(){
  let fileReader= new FileReader()
  fileReader.readAsDataURL(this.imgFile)
  fileReader.onload=(e)=>{
    this.imgUrl.set(e.target?.result)
  }
}
createPost(e:SubmitEvent,form:HTMLFormElement){
  e.preventDefault()
  console.log(this.PostBody.value);
  console.log(this.PostPrivacy.value);
  console.log(this.imgFile);
  let formData= new FormData()
  if(this.PostBody){
    formData.append('body',this.PostBody.value)
  }
  if(this.imgFile){
    formData.append('image',this.imgFile)
  }
  if(this.PostPrivacy){
    formData.append('privacy',this.PostPrivacy.value)
  }
  this.postsService.createPosts(formData).subscribe({
    next:(res)=>{
      console.log(res);
      this.getAllPosts()
      form.reset()
      this.imgUrl.set(null)
    },
    error:(err)=>{
      console.log(err);

    }
  })


}
deletePost(postId:string):void{
  this.postsService.deletePost(postId).subscribe({
    next:(res)=>{
      console.log(res);
      this.getAllPosts()
    },
    error:(err)=>{
      console.log(err);

    }
  })

}


editingPostId = signal<string | null>(null);
updatingPost = signal(false);
savingPostId = signal<string | null>(null);

editBody = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required],
});

editImage: File | null = null;

startEdit(post: Iposts): void {
  this.editingPostId.set(post._id);
  this.editBody.setValue(post.body ?? '');
  this.editImage = null;
}

onEditImageSelected(e: Event): void {
  const input = e.target as HTMLInputElement;
  this.editImage = input.files?.[0] ?? null;
}

cancelEdit(): void {
  this.editingPostId.set(null);
  this.editBody.reset('');
  this.editImage = null;
}



updatePost(postId: string): void {
  console.log('UPDATE METHOD CALLED');
  console.log('updatePost called:', postId, this.editBody.value);
  const newBody = this.editBody.value.trim();

  if (!newBody || this.updatingPost()) {
    this.editBody.markAsTouched();
    return;
  }

  const formData = new FormData();
  formData.append('body', newBody);

  if (this.editImage) {
    formData.append('image', this.editImage);
  }

  this.updatingPost.set(true);

  this.postsService.updatePost(postId, formData).subscribe({
    next: (res) => {
      console.log('Update response:', res);
      console.log('EDITED BODY:', this.editBody.value);
      console.log('POSTS ARRAY BEFORE:', this.allPosts());

      const updatedPost = res?.data?.post ?? res?.data;

      if (updatedPost && typeof updatedPost === 'object') {
        this.allPosts.update(posts =>
          posts.map(post =>
            post._id === postId
              ? {
                  ...post,
                  body: updatedPost.body ?? this.editBody.value.trim(),
                  image: updatedPost.image ?? post.image,
                  user: post.user,
                }
              : post
          )
        );
      } else {
        this.getAllPosts(this.currentPage());
      }

      this.toastr.success('Post updated successfully');
      this.cancelEdit();
      this.updatingPost.set(false);
    },
    error: (err) => {
      console.error('Update error:', err.status, err.error);

      this.toastr.error(
        err.error?.message ?? 'Failed to update post'
      );

      this.updatingPost.set(false);
    },
  });
}



toggleSavePost(postId: string): void {
  if (this.savingPostId()) return;

  this.savingPostId.set(postId);

  this.postsService.toggleBookmark(postId).subscribe({
    next: () => {
      this.toastr.success('Bookmark updated successfully');
      this.savingPostId.set(null);
    },
    error: (err) => {
      this.toastr.error(
        err.error?.message ?? 'Failed to save post'
      );
      this.savingPostId.set(null);
    },
  });
}


likingPostId = signal<string | null>(null);

likePost(post: any): void {
  if (this.likingPostId() === String(post.id)) return;

  this.likingPostId.set(String(post.id));

  this.postsService.likePost(String(post.id)).subscribe({
    next: (res) => {
      post.isLiked = res.data?.isLiked ?? !post.isLiked;

      if (typeof post.likesCount === 'number') {
        post.likesCount += post.isLiked ? 1 : -1;
      }

      this.likingPostId.set(null);
    },
    error: (err) => {
      console.error('Like error:', err.error ?? err);
      this.likingPostId.set(null);
    },
  });
}

async sharePost(postId: string): Promise<void> {
  const postUrl = `${window.location.origin}/posts/${postId}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Route Posts',
        text: 'Check out this post!',
        url: postUrl,
      });
    } else {
      await navigator.clipboard.writeText(postUrl);
      alert('Post link copied!');
    }
  } catch (err) {
    console.error('Share cancelled or failed:', err);
  }
}




}

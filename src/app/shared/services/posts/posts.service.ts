import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient=inject(HttpClient)
  getAllPosts(page:number=1):Observable<any>{
    return this.httpClient.get(`${environment.baseurl}/posts?page=${page}`)
  }
  createPosts(body:any):Observable<any>{
    return this.httpClient.post(`${environment.baseurl}/posts`,body)
  }
  getSinglePost(postId:any):Observable<any>{
    return this.httpClient.get(`${environment.baseurl}/posts/${postId}`)
  }
  updatePost(postId: string, body: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/posts/${postId}`,body);
    }
  deletePost(postId:any):Observable<any>{
    return this.httpClient.delete(`${environment.baseurl}/posts/${postId}`)
  }
  toggleBookmark(postId: string): Observable<any> {
    return this.httpClient.put(`${environment.baseurl}/posts/${postId}/bookmark`,{});
  }

  likePost(postId: string): Observable<any> {return this.httpClient.put(`${environment.baseurl}/posts/${postId}/like`,{});
  }

}

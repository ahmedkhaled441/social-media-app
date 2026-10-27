import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient=inject(HttpClient)

  getPostComments(postId:any):Observable<any>{
    return this.httpClient.get(`${environment.baseurl}/posts/${postId}/comments`)
  }
  createComments(body:any,postId:any):Observable<any>{
    return this.httpClient.post(`${environment.baseurl}/posts/${postId}/comments`,body)
  }
  updateComment(postId: string,commentId: string,body: FormData): Observable<any>
  {return this.httpClient.put(`${environment.baseurl}/posts/${postId}/comments/${commentId}`,body);
  }

  deleteComment(postId: string,commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseurl}/posts/${postId}/comments/${commentId}`);
  }
}

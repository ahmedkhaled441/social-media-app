import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient=inject(HttpClient)
  private readonly router=inject(Router)
  signup(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseurl}/users/signup`,data )
  }
  signin(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseurl}/users/signin`,data )
  }
  logout(){
    localStorage.removeItem('socialToken')
    localStorage.removeItem('socialUer')
    this.router.navigate(['/login'])
  }
}

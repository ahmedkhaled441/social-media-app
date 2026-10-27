import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  let toaster=inject(ToastrService)
  return next(req).pipe(catchError((err)=>{
    console.log('error from interceptor',err.error.message);
    toaster.error(err.error.message,'Error',{
      progressBar:true, timeOut:3000
    })

    return throwError(()=>err)
  }));
};

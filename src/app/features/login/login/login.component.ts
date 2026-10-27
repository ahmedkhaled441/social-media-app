import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading:WritableSignal<boolean>=signal(false)
  msgError:string=''
  private readonly authService=inject(AuthService)
  private readonly router=inject(Router)

  loginForm:FormGroup=new FormGroup ({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/),
    ]),
  })
  login(){
 if(this.loginForm.valid){
  this.loading.set(true)
  console.log(this.loginForm.value)
  this.authService.signin(this.loginForm.value).subscribe({
    next:(res)=>{
      console.log(res);
      localStorage.setItem('socialToken',res.data.token)
      localStorage.setItem('socialUer',JSON.stringify(res.data.user))

      //navigate to login
      this.router.navigate(['/feeds'])
    },
    error:(err)=>{
      console.log(err);
      this.msgError=err.error.message
      this.loading.set(false)
            //show error
    },
    complete:()=>{
      this.loading.set(false)
        }
  })
 }else{
  this.loginForm.markAllAsTouched()
 }
  }
  togglePass(Pass:any){
if(Pass.type==='password'){
  Pass.type='text'
}
else{
  Pass.type='password'
}
  }
}

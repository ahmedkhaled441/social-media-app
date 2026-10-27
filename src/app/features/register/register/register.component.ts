import { Component, inject, signal, WritableSignal  } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  loading:WritableSignal<boolean>=signal(false)
  msgError:string=''
  private readonly authService=inject(AuthService)
  private readonly router=inject(Router)

  registerForm:FormGroup=new FormGroup ({
    name:new FormControl('', [Validators.required , Validators.minLength(3),Validators.maxLength(20),
      Validators.pattern(/^[A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,}){0,3}$/),
    ]),
    username:new FormControl(null, [Validators.minLength(3),Validators.maxLength(15),Validators.pattern(/^[a-z0-9_]{3,15}$/),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    dateOfBirth: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required, Validators.pattern(/^(?:male|female)$/)]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/),
    ]),
    rePassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/),
    ]),
  },{validators:this.confirmPass})

  confirmPass(x:AbstractControl){
return x.get('password')?.value === x.get('rePassword')?.value ?null : {missmatch:true}
  }

  register(){
 if(this.registerForm.valid){
  this.loading.set(true)
  console.log(this.registerForm.value)
  this.authService.signup(this.registerForm.value).subscribe({
    next:(res)=>{
      console.log(res);
      //navigate to login
      this.router.navigate(['/login'])
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
  this.registerForm.markAllAsTouched()
 }
  }
}

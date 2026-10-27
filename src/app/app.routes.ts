import { ChangePasswordComponent } from './features/profile/change-password/change-password.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthlayoutComponent } from './layouts/authlayout/authlayout.component';
import { LoginComponent } from './features/login/login/login.component';
import { RegisterComponent } from './features/register/register/register.component';
import { MainlayoutComponent } from './layouts/mainlayout/mainlayout.component';
import { NotfoundComponent } from './features/notfound/notfound/notfound.component';
import { authGuard } from './core/guards/auth-guard';
import { alreadyloggedGuard } from './core/guards/alreadylogged-guard';

export const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'',component:AuthlayoutComponent, canActivate:[alreadyloggedGuard], children:[
    {path:'login',component:LoginComponent,title:'Route | login'},
    {path:'register',component:RegisterComponent,title:'Route | register'}
  ]},
  {path:'',canActivate:[authGuard],component:MainlayoutComponent,children:[
    {path:'feeds',loadComponent:()=>import('./features/feeds/feeds/feeds.component').then((c)=>c.FeedsComponent),title:'Route | feeds'},
    {path:'post-details/:id',loadComponent:()=>import('./features/post-details/post-details.component').then((c)=>c.PostDetailsComponent),title:'Route | post-details'},
    {path:'profile',loadComponent:()=>import('./features/profile/profile/profile.component').then((c)=>c.ProfileComponent),title:'Route | profile'},
    {path:'notifications',loadComponent:()=>import('./features/notification/notification/notification.component').then((c)=>c.NotificationComponent),title:'Route | notification'},
    {path: 'change-password',loadComponent: () =>import('./features/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent),title: 'Route | Change Password'
    }
  ]},
  {path:'**',component:NotfoundComponent,title:'error'}
];

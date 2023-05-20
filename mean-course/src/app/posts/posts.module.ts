import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostRoutingModule } from './posts-routing.module';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule,
    PostRoutingModule,
  ],
})
export class PostsModule {}

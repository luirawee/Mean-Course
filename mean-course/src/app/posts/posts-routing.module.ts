import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './post-create/post-create.component';

const routes: Routes = [
  {
    path: 'create',
    component: PostCreateComponent,
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRoutingModule {}

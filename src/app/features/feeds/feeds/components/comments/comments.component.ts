
import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../../../../shared/services/comments/comments.service';
import { Icomments } from '../../../../../core/models/icomments.interface';
import { Iposts, IUser } from '../../../../../core/models/iposts.interface';


@Component({
  selector: 'app-comments',
  imports: [FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  PostId: InputSignal<string> = input.required<string>();
  loggedUserData:WritableSignal<IUser>= signal({} as IUser)

  postComments: WritableSignal<Icomments[]> = signal([]);
  editingCommentId = signal<string | null>(null);
editContent = signal('');
actionLoading = signal(false);

  commentContent = signal('');
  selectedFile = signal<File | null>(null);
  loading = signal(false);
  msgError = signal('');
post: any;

saveUserData(): void {
  const userData = localStorage.getItem('socialUer');

  if (userData) {
    this.loggedUserData.set(JSON.parse(userData));
  }
}


ngOnInit(): void {
  this.saveUserData();
  this.getPostComment();
}

  getPostComment(): void {
    this.commentsService.getPostComments(this.PostId()).subscribe({
      next: (res) => {
        this.postComments.set(res.data.comments ?? []);
      },
      error: (err) => {
        console.error('Get comments error:', err);
      },
    });
  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedFile.set(inputElement.files?.[0] ?? null);
  }

  createComment(fileInput?: HTMLInputElement): void {
    const content = this.commentContent().trim();
    const file = this.selectedFile();

    if (this.loading() || (!content && !file)) {
      return;
    }

    const formData = new FormData();

    if (content) {
      formData.append('content', content);
    }

    if (file) {
      formData.append('image', file);
    }

    this.loading.set(true);
    this.msgError.set('');

    this.commentsService
      .createComments(formData, this.PostId())
      .subscribe({
        next: () => {
          this.commentContent.set('');
          this.selectedFile.set(null);

          if (fileInput) {
            fileInput.value = '';
          }

          this.getPostComment();
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.msgError.set(
            err.error?.message || 'Failed to create comment'
          );
          console.error('Create comment error:', err);
        },
      });

  }
  startEdit(comment: Icomments): void {
    this.editingCommentId.set(comment._id);
    this.editContent.set(comment.content || '');
    this.msgError.set('');
  }

  cancelEdit(): void {
    this.editingCommentId.set(null);
    this.editContent.set('');
    this.msgError.set('');
  }

  updateComment(commentId: string): void {
    const content = this.editContent().trim();

    if (!content || this.actionLoading()) {
      return;
    }

    const formData = new FormData();
    formData.append('content', content);

    this.actionLoading.set(true);
    this.msgError.set('');

    this.commentsService
      .updateComment(this.PostId(), commentId, formData)
      .subscribe({
        next: () => {
          this.actionLoading.set(false);
          this.cancelEdit();
          this.getPostComment();
        },
        error: (err: any) => {
          this.actionLoading.set(false);

          this.msgError.set(
            err?.error?.message || 'Failed to update comment'
          );

          console.error('Update comment error:', err);
        },
      });
  }

  deleteComment(commentId: string): void {
    if (this.actionLoading()) return;

    const confirmed = confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    this.actionLoading.set(true);
    this.msgError.set('');

    this.commentsService
      .deleteComment(this.PostId(), commentId)
      .subscribe({
        next: () => {
          this.actionLoading.set(false);

          this.postComments.update((comments) =>
            comments.filter((comment) => comment._id !== commentId)
          );
        },
        error: (err: any) => {
          this.actionLoading.set(false);

          this.msgError.set(
            err?.error?.message || 'Failed to delete comment'
          );

          console.error('Delete comment error:', err);
        },
      });
  }
}


import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { PostsService } from '../../../shared/services/posts/posts.service';
import { Iposts } from '../../../core/models/iposts.interface';
import { RouterLink } from '@angular/router';


type ProfileTab = 'posts' | 'saved';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly postsService = inject(PostsService);

  userProfile = this.userService.userProfile;

  allPosts = signal<Iposts[]>([]);
  activeTab = signal<ProfileTab>('posts');
  loadingPosts = signal(false);
  errorMessage = signal('');

  myPosts = computed(() => {
    const userId = this.userProfile()?._id;

    if (!userId) return [];

    return this.allPosts().filter(
      post => post.user?._id === userId
    );
  });

  savedPosts = computed(() =>
    this.allPosts().filter(post => post.bookmarked === true)
  );

  displayedPosts = computed(() =>
    this.activeTab() === 'posts'
      ? this.myPosts()
      : this.savedPosts()
  );

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData(): void {
    this.userService.getMyProfileData().subscribe({
      next: res => {
        this.userProfile.set(res.data.user);
        this.getAllPosts();
      },
      error: err => {
        this.errorMessage.set(
          err.error?.message || 'Failed to load profile.'
        );
      },
    });
  }

  getAllPosts(): void {
    this.loadingPosts.set(true);

    this.postsService.getAllPosts(1).subscribe({
      next: res => {
        this.allPosts.set(res.data.posts ?? []);
      },
      error: err => {
        this.errorMessage.set(
          err.error?.message || 'Failed to load posts.'
        );
      },
      complete: () => this.loadingPosts.set(false),
    });
  }

  selectTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  uploadingPhoto = signal(false);

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || this.uploadingPhoto()) return;

    this.uploadingPhoto.set(true);

    this.userService.uploadProfilePhoto(file).subscribe({
      next: res => {
        const photo = res.data?.photo;

        if (photo) {
          this.userProfile.update(current =>
            current ? { ...current, photo } : current
          );
        }
      },
      error: err => {
        this.errorMessage.set(
          err.error?.message || 'Failed to upload photo.'
        );
        this.uploadingPhoto.set(false);
        input.value = '';
      },
      complete: () => {
        this.uploadingPhoto.set(false);
        input.value = '';
      },
    });
  }


  coverPreview = signal<string | null>(
    localStorage.getItem('profileCover')
  );

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      input.value = '';
      return;
    }

    // Limit image size to 2 MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result as string;

      try {
        localStorage.setItem('profileCover', imageData);
        this.coverPreview.set(imageData);
      } catch {
        alert('Could not save the image. Try a smaller image.');
      }
    };

    reader.readAsDataURL(file);
    input.value = '';
  }


}

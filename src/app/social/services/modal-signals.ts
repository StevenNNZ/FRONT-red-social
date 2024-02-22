import { computed, signal } from '@angular/core';
import { Post } from '../interfaces/post.interface';
import { User } from '../interfaces/user.interface';

export const modalUpdatePostActive = computed(() =>
  modalUpdatePostData() ? true : false
);
export const modalUpdateProfileActive = computed(() =>
  modalUpdateProfileData() ? true : false
);

export const modalUpdatePostData = signal<Post | undefined>(undefined);
export const modalUpdateProfileData = signal<User | undefined>(undefined);

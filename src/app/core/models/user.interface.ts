export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  photo?: string;
  cover?: string;
  username?: string;
  bookmarks: string[];
  followers: string[];
  following: string[];
  followingCount?: number;
  followersCount?: number;
  bookmarksCount?: number;
  createdAt?: string;
}

export interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  mutualFollowersCount: number;
  isFollowing?: boolean;
}

export interface SuggestedPaginationInfo {
  currentPage: number;
  limit: number;
  nextPage?: number | null;
  numberOfPages: number;
  total: number;
}



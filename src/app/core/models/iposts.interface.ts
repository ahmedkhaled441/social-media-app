export interface Iposts {
  _id:           string;
  body?:          string;
  image?:          string;
  privacy:       string;
  user:          IUser;
  sharedPost:    null;
  likes:         any[];
  createdAt:     Date;
  commentsCount: number;
  topComment:    null;
  sharesCount:   number;
  likesCount:    number;
  isShare:       boolean;
  id:            string;
  bookmarked:    boolean;
  isLiked: boolean;
}

export interface IUser {
  _id:      string;
  name:     string;
  username: string;
  photo:    string;
}

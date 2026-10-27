export interface Icomments {
  _id:            string;
  content:        string;
  commentCreator: CommentCreator;
  post:           string;
  parentComment:  null;
  likes:          any[];
  createdAt:      string;
  repliesCount:   number;
}

export interface CommentCreator {
  _id:      string;
  name:     string;
  username: string;
  photo:    string;
}

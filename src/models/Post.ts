export interface PostDB {
  id: string;
  creator_id: string;
  post_content: string;
  likes: number;
  dislikes: number;
  comments: number;
  created_at: string;
}

export interface PostDBWithCreatorName {
  id: string;
  creator_id: string;
  post_content: string;
  likes: number;
  dislikes: number;
  comments: number;
  created_at: string;
  creator_name: string;
}

export interface PostModel {
  id: string;
  postContent: string;
  likes: number;
  dislikes: number;
  comments: number;
  createdAt: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface LikeDislikePostDB {
  user_id: string;
  post_id: string;
  like: number;
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY_LIKED",
  ALREADY_DISLIKED = "ALREADY_DISLIKED",
}

export class Post {
  constructor(
    private id: string,
    private postContent: string,
    private likes: number,
    private dislikes: number,
    private comments: number,
    private createdAt: string,
    private creatorId: string,
    private creatorName: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getContent(): string {
    return this.postContent;
  }
  public setContent(value: string) {
    this.postContent = value;
  }

  public getLikes(): number {
    return this.likes;
  }
  public setLikes(value: number) {
    this.likes = value;
  }
  public addLike = (): void => {
    this.likes++;
  };
  public removeLike = (): void => {
    this.likes--;
  };

  public getDislikes(): number {
    return this.dislikes;
  }
  public setDislikes(value: number) {
    this.dislikes = value;
  }
  public addDislike = (): void => {
    this.dislikes++;
  };
  public removeDislike = (): void => {
    this.dislikes--;
  };

  public getComments(): number {
    return this.comments;
  }
  public setComments(value: number) {
    this.comments = value;
  }
  public addComment(): void {
    this.comments++;
  }
  public removeComment(): void {
    this.comments--;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getCreatorId(): string {
    return this.creatorId;
  }
  public setCreatorId(value: string) {
    this.creatorId = value;
  }

  public getCreatorName(): string {
    return this.creatorName;
  }
  public setCreatorName(value: string) {
    this.creatorName = value;
  }

  public toDBModel(): PostDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      post_content: this.postContent,
      likes: this.likes,
      dislikes: this.dislikes,
      comments: this.comments,
      created_at: this.createdAt,
    };
  }

  public toBusinessModel(): PostModel {
    return {
      id: this.id,
      postContent: this.postContent,
      likes: this.likes,
      dislikes: this.dislikes,
      comments: this.comments,
      createdAt: this.createdAt,
      creator: {
        id: this.creatorId,
        name: this.creatorName,
      },
    };
  }
}

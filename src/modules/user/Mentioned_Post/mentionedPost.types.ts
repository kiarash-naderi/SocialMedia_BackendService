export interface MentionedPostAuthorDto {
  id: string;
  name: string | null;
  avatar: string | null;
  username: string;
}

export interface MentionedPostItemDto {
  mentionId: string;
  createdAt: string;
  post: {
    id: string;
    caption: string | null;
    thumbnail: string | null;
    author: MentionedPostAuthorDto;
  };
}

export interface MentionedPostsResponseDto {
  success: boolean;
  message: string;
  data: {
    items: MentionedPostItemDto[];
    pagination: {
      page: number;
      limit: number;
      total_records: number;
      total_pages: number;
    };
  };
}
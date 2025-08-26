export interface CreatePostRequest {
  caption?: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    caption: string | null;
    images: { url: string }[];
  };
}
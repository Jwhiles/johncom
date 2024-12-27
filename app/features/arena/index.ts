// Types for Are.na API responses
interface User {
  id: number;
  slug: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  channel_count: number;
  following_count: number;
  follower_count: number;
  profile_id: number;
  class: "User";
  initials: string;
}

interface Channel {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  open: boolean;
  collaboration: boolean;
  slug: string;
  length: number;
  kind: "default" | "profile";
  status: "private" | "closed" | "public";
  user_id: number;
  class: "Channel";
  base_class: "Channel";
  user: User;
  total_pages?: number;
  current_page?: number;
  per?: number;
  follower_count: number;
  contents?: Array<Block | Channel>;
  collaborators?: Array<User>;
}

interface Block {
  position?: number;
  selected?: boolean;
  connected_at: string;
  connected_by_user_id: number;
  id: number;
  title: string | null;
  updated_at: string;
  created_at: string;
  state: string;
  comment_count: number;
  generated_title: string;
  class: "Image" | "Text" | "Link" | "Media" | "Attachment";
  base_class: "Block";
  content: string | null;
  content_html: string | null;
  description: string | null;
  description_html: string | null;
  source: {
    url: string;
    provider: {
      name: string;
      url: string;
    };
  } | null;
  image: {
    filename: string;
    content_type: string;
    updated_at: string;
    thumb: {
      url: string;
    };
    display: {
      url: string;
    };
    original: {
      url: string;
      file_size: number;
      file_size_display: string;
    };
  } | null;
  user: User;
  connections: Array<Channel>;
}

interface PaginationParams {
  page?: number;
  per?: number;
}

interface CreateChannelParams {
  title: string;
  status?: "public" | "closed" | "private";
}

interface UpdateChannelParams {
  title?: string;
  status?: "public" | "closed" | "private";
}

interface CreateBlockParams {
  source?: string;
  content?: string;
}

class ArenaClient {
  private baseUrl: string;
  private authToken?: string;

  constructor(authToken?: string) {
    this.baseUrl = "http://api.are.na/v2";
    this.authToken = authToken;
  }

  private async request<T>(
    endpoint: string,
    method = "GET",
    data?: unknown,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Channels
  async getChannels(params?: PaginationParams): Promise<Array<Channel>> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return this.request<Array<Channel>>(
      `/channels${queryParams ? `?${queryParams}` : ""}`,
    );
  }

  async getChannel(slug: string): Promise<Channel> {
    return this.request<Channel>(`/channels/${slug}`);
  }

  async getChannelThumb(slug: string): Promise<Channel> {
    return this.request<Channel>(`/channels/${slug}/thumb`);
  }

  async getChannelContents(
    id: string | number,
    params?: PaginationParams,
  ): Promise<Pick<Channel, "contents">> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return this.request<Pick<Channel, "contents">>(
      `/channels/${id}/contents${queryParams ? `?${queryParams}` : ""}`,
    );
  }

  async createChannel(params: CreateChannelParams): Promise<Channel> {
    return this.request<Channel>("/channels", "POST", params);
  }

  async updateChannel(
    slug: string,
    params: UpdateChannelParams,
  ): Promise<Channel> {
    return this.request<Channel>(`/channels/${slug}`, "PUT", params);
  }

  async sortChannel(slug: string, ids: Array<number>): Promise<Channel> {
    return this.request<Channel>(`/channels/${slug}/sort`, "PUT", { ids });
  }

  async deleteChannel(slug: string): Promise<void> {
    return this.request<void>(`/channels/${slug}`, "DELETE");
  }

  // Blocks
  async createBlock(
    channelSlug: string,
    params: CreateBlockParams,
  ): Promise<Block> {
    if (!params.source && !params.content) {
      throw new Error("Either source or content must be provided");
    }
    if (params.source && params.content) {
      throw new Error("Cannot provide both source and content");
    }
    return this.request<Block>(
      `/channels/${channelSlug}/blocks`,
      "POST",
      params,
    );
  }

  async toggleBlockSelection(
    channelId: number | string,
    blockId: number,
  ): Promise<void> {
    return this.request<void>(
      `/channels/${channelId}/blocks/${blockId}/selection`,
      "PUT",
    );
  }

  // Collaborators
  async getCollaborators(id: string | number): Promise<Array<User>> {
    return this.request<Array<User>>(`/channels/${id}/collaborators`);
  }

  async addCollaborators(
    id: string | number,
    collaboratorIds: Array<number>,
  ): Promise<Array<User>> {
    return this.request<Array<User>>(`/channels/${id}/collaborators`, "POST", {
      ids: collaboratorIds,
    });
  }

  async removeCollaborators(
    id: string | number,
    remainingCollaboratorIds: Array<number>,
  ): Promise<Array<User>> {
    return this.request<Array<User>>(`/channels/${id}/collaborators`, "DELETE", {
      ids: remainingCollaboratorIds,
    });
  }

  // Users
  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserChannel(id: number): Promise<Channel> {
    return this.request<Channel>(`/users/${id}/channel`);
  }

  async getUserChannels(
    id: string,
    params?: PaginationParams,
  ): Promise<Array<Channel>> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return this.request<Array<Channel>>(
      `/users/${id}/channels${queryParams ? `?${queryParams}` : ""}`,
    );
  }

  async getUserFollowing(
    id: number,
    params?: PaginationParams,
  ): Promise<Array<User | Channel>> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return this.request<Array<User | Channel>>(
      `/users/${id}/following${queryParams ? `?${queryParams}` : ""}`,
    );
  }

  async getUserFollowers(
    id: number,
    params?: PaginationParams,
  ): Promise<Array<User>> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return this.request<Array<User>>(
      `/users/${id}/followers${queryParams ? `?${queryParams}` : ""}`,
    );
  }
}

export default ArenaClient;

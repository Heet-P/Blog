export interface Post {
    id: string; // uuid
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    tags: string[];
    read_time: string | null;
    published: boolean;
    created_at: string;
    updated_at: string;
}

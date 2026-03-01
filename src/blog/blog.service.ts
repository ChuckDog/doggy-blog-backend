import { Injectable } from '@nestjs/common';
// removed prisma usage

export interface BlogPostDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  readTime: number;
}

export interface BlogCategoryDto {
  id: string;
  name: string;
  count: number;
}

export interface BlogTagDto {
  id: string;
  name: string;
  count: number;
}

@Injectable()
export class BlogService {
  private data: BlogPostDto[] = [
    {
      id: '1',
      title: '我的第一只金毛犬',
      excerpt: '分享我与金毛犬小白的美好时光，从初次见面到成为最好的朋友。',
      content: '## 我的第一只金毛犬\n去年春天，我在宠物店第一次见到了小白。',
      author: '爱狗人士小王',
      date: '2024-01-15',
      category: '生活分享',
      tags: ['金毛犬', '宠物故事', '日常'],
      imageUrl: '',
      readTime: 5,
    },
    {
      id: '2',
      title: '狗狗训练心得分享',
      excerpt: '三年养狗经验总结，教你如何正确训练你的毛孩子。',
      content: '## 狗狗训练心得分享\n养狗三年，我总结了一些实用的方法。',
      author: '训犬师李明',
      date: '2024-01-20',
      category: '训练指南',
      tags: ['训练技巧', '行为矫正', '新手必读'],
      imageUrl: '',
      readTime: 8,
    },
    {
      id: '3',
      title: '狗狗营养食谱推荐',
      excerpt: '为你的毛孩子制定科学的饮食计划，让它们健康成长。',
      content: '## 狗狗营养食谱推荐\n合理的饮食是狗狗健康的基础。',
      author: '宠物营养师张医生',
      date: '2024-01-25',
      category: '健康饮食',
      tags: ['营养搭配', '自制狗粮', '健康管理'],
      imageUrl: '',
      readTime: 6,
    },
    {
      id: '4',
      title: '带狗狗旅行的注意事项',
      excerpt: '这些准备事项你必须知道！',
      content: '## 带狗狗旅行的注意事项\n狗狗也是家庭成员。',
      author: '旅行博主小美',
      date: '2024-02-01',
      category: '生活分享',
      tags: ['旅行攻略', '户外活动', '经验分享'],
      imageUrl: '',
      readTime: 7,
    },
    {
      id: '5',
      title: '边境牧羊犬的智商训练法',
      excerpt: '让你的聪明狗狗更出色。',
      content: '## 边境牧羊犬的智商训练法\n充分发挥它们的智力潜能。',
      author: '专业训犬师陈教练',
      date: '2024-02-05',
      category: '训练指南',
      tags: ['边境牧羊犬', '智商训练', '高级技能'],
      imageUrl: '',
      readTime: 9,
    },
    {
      id: '6',
      title: '泰迪犬美容护理全攻略',
      excerpt: '手把手教你打造可爱时尚的泰迪宝贝。',
      content: '## 泰迪犬美容护理全攻略\n正确的美容护理能让它们更加迷人。',
      author: '宠物美容师Lisa',
      date: '2024-02-10',
      category: '健康饮食',
      tags: ['泰迪犬', '美容护理', '造型设计'],
      imageUrl: '',
      readTime: 6,
    },
    {
      id: '7',
      title: '狗狗社交化训练指南',
      excerpt: '培养良好的社交能力。',
      content: '## 狗狗社交化训练指南\n良好的社交能力是幸福生活的基础。',
      author: '行为矫正专家王博士',
      date: '2024-02-15',
      category: '训练指南',
      tags: ['社交训练', '行为矫正', '心理发展'],
      imageUrl: '',
      readTime: 8,
    },
    {
      id: '8',
      title: '老年犬关爱手册',
      excerpt: '贴心照顾你做到了吗？',
      content: '## 老年犬关爱手册\n需要我们更多的理解和关怀。',
      author: '资深宠物医生Dr.孙',
      date: '2024-02-20',
      category: '健康饮食',
      tags: ['老年犬', '健康管理', '爱心护理'],
      imageUrl: '',
      readTime: 7,
    },
    {
      id: '9',
      title: '狗狗摄影技巧大公开',
      excerpt: '捕捉狗狗最美瞬间的专业摄影秘籍。',
      content: '## 狗狗摄影技巧大公开\n关键是如何完美呈现。',
      author: '宠物摄影师阿Ken',
      date: '2024-02-25',
      category: '生活分享',
      tags: ['狗狗摄影', '拍照技巧', '艺术创作'],
      imageUrl: '',
      readTime: 6,
    },
    {
      id: '10',
      title: '城市养犬法规解读',
      excerpt: '做负责任的文明养犬人。',
      content: '## 城市养犬法规解读\n依法养犬是基本义务。',
      author: '法律咨询师刘律师',
      date: '2024-03-01',
      category: '生活分享',
      tags: ['养犬法规', '文明养犬', '社会责任'],
      imageUrl: '',
      readTime: 8,
    },
  ];

  async getPosts(): Promise<BlogPostDto[]> {
    return [...this.data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async getPostById(id: number): Promise<BlogPostDto | null> {
    const p = this.data.find((x) => x.id === String(id));
    return p ?? null;
  }

  async getCategories(): Promise<BlogCategoryDto[]> {
    const map = new Map<string, number>();
    for (const p of this.data)
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, count]) => ({
      id: this.toId(name),
      name,
      count,
    }));
  }

  async getTags(): Promise<BlogTagDto[]> {
    const map = new Map<string, number>();
    for (const p of this.data)
      for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1);
    return Array.from(map.entries()).map(([name, count]) => ({
      id: this.toId(name),
      name,
      count,
    }));
  }

  async getPostsByCategory(categorySlug: string): Promise<BlogPostDto[]> {
    const name = this.unslugify(categorySlug);
    return this.getPosts().then((list) =>
      list.filter((p) => p.category === name),
    );
  }

  async getPostsByTag(tagSlug: string): Promise<BlogPostDto[]> {
    const tagName = this.unslugify(tagSlug);
    return this.getPosts().then((list) =>
      list.filter((p) => p.tags.includes(tagName)),
    );
  }

  async searchPosts(keyword: string): Promise<BlogPostDto[]> {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return [];
    return this.getPosts().then((list) =>
      list.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.excerpt.toLowerCase().includes(kw) ||
          p.content.toLowerCase().includes(kw) ||
          p.tags.some((t) => t.toLowerCase().includes(kw)),
      ),
    );
  }

  private mapPost(p: any): BlogPostDto {
    return p as BlogPostDto;
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private slugify(input: string): string {
    return input
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
  private unslugify(slug: string): string {
    try {
      return decodeURIComponent(slug).replace(/-/g, ' ');
    } catch {
      return slug.replace(/-/g, ' ');
    }
  }
  private toId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}

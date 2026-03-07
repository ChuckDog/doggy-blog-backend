import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString }) as any;
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Ensure tables exist manually because migrate commands are failing in this environment
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "bio" TEXT,
        "avatar" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "categories" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "tags" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "posts" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "content" TEXT NOT NULL,
        "excerpt" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "imageUrl" TEXT,
        "authorId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        "categoryId" INTEGER NOT NULL REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "comments" (
        "id" SERIAL PRIMARY KEY,
        "content" TEXT NOT NULL,
        "authorId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        "postId" INTEGER NOT NULL REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "_PostToTag" (
        "A" INTEGER NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "B" INTEGER NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = '_PostToTag_AB_unique') THEN
          CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");
        END IF;
      END
      $$;

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = '_PostToTag_B_index') THEN
          CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");
        END IF;
      END
      $$;
    `);
  } finally {
    client.release();
  }

  const email = 'admin@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      bio: 'Administrator of the blog',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  console.log({ user });

  const category = await prisma.category.upsert({
    where: { name: 'General' },
    update: {},
    create: {
      name: 'General',
    },
  });

  console.log({ category });

  const posts = [
    {
      title: '我的第一只金毛犬',
      excerpt: '分享我与金毛犬小白的美好时光，从初次见面到成为最好的朋友。',
      content:
        '## 我的第一只金毛犬\n去年春天，我在宠物店第一次见到了小白。它有着金色的毛发和温柔的眼神，一下子就俘获了我的心。\n\n### 初次相遇\n那天是周末，我和朋友一起去宠物店逛街。刚进门就看到一只小金毛在笼子里，它正用那双水汪汪的大眼睛看着我们。我蹲下来和它对视，它竟然主动把爪子伸向我。\n\n### 成长历程\n带回家后，小白很快就适应了新环境。它特别聪明，三个月就能学会基本指令。最让我感动的是它的忠诚，无论我多晚回家，它都会在门口等我。\n\n### 日常趣事\n小白有个特别的习惯，每天早上都要在我的床边"叫醒"我。它会轻轻地把鼻子凑到我脸上，然后发出温柔的哼声。这种自然的闹钟比任何电子设备都有效！\n\n现在小白已经一岁多了，依然是我最忠实的伙伴。有时候我想，也许不是我收养了它，而是它选择了我作为它的人类朋友。',
      category: '生活分享',
      tags: ['金毛犬', '宠物故事', '日常'],
      published: true,
      slug: 'my-first-golden-retriever',
    },
    {
      title: '狗狗训练心得分享',
      excerpt: '三年养狗经验总结，教你如何正确训练你的毛孩子。',
      content:
        '## 狗狗训练心得分享\n养狗三年，我总结了一些实用的训练方法，希望能帮助更多狗主人。\n\n### 基础训练原则\n1. **一致性最重要**\n   - 所有家庭成员要使用相同的指令\n   - 训练时间和地点要固定\n   - 奖惩标准要明确\n\n2. **正面强化**\n   - 用零食和表扬奖励正确行为\n   - 避免体罚，会造成恐惧心理\n   - 耐心等待，给狗狗思考时间\n\n3. **循序渐进**\n   - 从简单指令开始（坐下、握手）\n   - 逐步增加难度\n   - 每次训练不超过15分钟\n\n### 常见问题解决\n**乱叫问题：**\n- 找出叫声的原因（饥饿、无聊、警戒）\n- 针对性地解决问题\n- 教会"安静"指令\n\n**随地大小便：**\n- 建立固定的外出时间\n- 便后及时奖励\n- 耐心引导，不要急躁\n\n### 我的经验\n记住，每只狗狗都有自己的性格特点。有的活泼好动，有的安静内向。作为主人，我们要做的不是改变它们的天性，而是引导它们发挥最好的一面。',
      category: '训练指南',
      tags: ['训练技巧', '行为矫正', '新手必读'],
      published: true,
      slug: 'dog-training-tips',
    },
    {
      title: '狗狗营养食谱推荐',
      excerpt: '为你的毛孩子制定科学的饮食计划，让它们健康成长。',
      content:
        '## 狗狗营养食谱推荐\n合理的饮食是狗狗健康的基础，今天分享一些我家狗狗的食谱。\n\n### 营养需求分析\n不同年龄和体型的狗狗营养需求不同：\n\n**幼犬期（0-12个月）：**\n- 需要高蛋白支持生长发育\n- 钙质补充促进骨骼健康\n- 少量多餐，一天3-4次\n\n**成犬期（1-7岁）：**\n- 维持体重，避免肥胖\n- 均衡营养，增强免疫力\n- 一天2餐即可\n\n**老年犬（7岁以上）：**\n- 易消化的食物\n- 关节保护成分\n- 控制热量摄入\n\n### 推荐食谱\n**鸡肉蔬菜饭：**\n- 鸡胸肉200g（煮熟切丁）\n- 胡萝卜1根（蒸熟切碎）\n- 西兰花100g（焯水）\n- 米饭1碗\n- 橄榄油1勺\n\n**三文鱼燕麦粥：**\n- 三文鱼150g（去骨蒸熟）\n- 燕麦片50g\n- 南瓜100g（蒸熟压泥）\n- 少许菠菜叶\n\n### 注意事项\n❌ 不要喂食：巧克力、洋葱、葡萄、木糖醇\n✅ 可以适量：苹果、胡萝卜、酸奶、鸡蛋\n💡 建议咨询兽医制定个性化食谱',
      category: '健康饮食',
      tags: ['营养搭配', '自制狗粮', '健康管理'],
      published: true,
      slug: 'dog-nutrition-recipes',
    },
  ];

  for (const postData of posts) {
    const { category: categoryName, tags: tagNames, ...rest } = postData;

    // Create or connect category
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    // Create or connect tags
    const tags = await Promise.all(
      tagNames.map((tagName) =>
        prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        }),
      ),
    );

    // Create post
    await prisma.post.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        authorId: user.id,
        categoryId: category.id,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    console.log(`Created post: ${rest.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

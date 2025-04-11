import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@lattkia.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'الإلكترونيات',
        description: 'أجهزة إلكترونية وملحقاتها',
        image: 'https://example.com/electronics.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'الملابس',
        description: 'ملابس رجالية ونسائية وأطفال',
        image: 'https://example.com/clothes.jpg'
      }
    })
  ]);

  // Create subcategories
  const subcategories = await Promise.all([
    prisma.subcategory.create({
      data: {
        name: 'الهواتف الذكية',
        description: 'هواتف ذكية من مختلف الماركات',
        image: 'https://example.com/smartphones.jpg',
        categoryId: categories[0].id
      }
    }),
    prisma.subcategory.create({
      data: {
        name: 'الحواسيب المحمولة',
        description: 'حواسيب محمولة من مختلف الماركات',
        image: 'https://example.com/laptops.jpg',
        categoryId: categories[0].id
      }
    }),
    prisma.subcategory.create({
      data: {
        name: 'ملابس رجالية',
        description: 'ملابس رجالية عصرية',
        image: 'https://example.com/mens-clothes.jpg',
        categoryId: categories[1].id
      }
    }),
    prisma.subcategory.create({
      data: {
        name: 'ملابس نسائية',
        description: 'ملابس نسائية عصرية',
        image: 'https://example.com/womens-clothes.jpg',
        categoryId: categories[1].id
      }
    })
  ]);

  // Create products
  await Promise.all([
    prisma.product.create({
      data: {
        name: 'iPhone 13 Pro',
        description: 'هاتف آيفون 13 برو الجديد',
        price: 999.99,
        image: 'https://example.com/iphone13pro.jpg',
        categoryId: categories[0].id,
        subcategoryId: subcategories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'MacBook Pro',
        description: 'حاسوب ماك بوك برو الجديد',
        price: 1499.99,
        image: 'https://example.com/macbookpro.jpg',
        categoryId: categories[0].id,
        subcategoryId: subcategories[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'قميص رجالي',
        description: 'قميص رجالي أنيق',
        price: 49.99,
        image: 'https://example.com/mens-shirt.jpg',
        categoryId: categories[1].id,
        subcategoryId: subcategories[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'فستان نسائي',
        description: 'فستان نسائي أنيق',
        price: 79.99,
        image: 'https://example.com/womens-dress.jpg',
        categoryId: categories[1].id,
        subcategoryId: subcategories[3].id
      }
    })
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
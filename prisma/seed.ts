import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('15124353asS$', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'andrewmartinstarkey@gmail.com' },
    update: {},
    create: {
      email: 'andrewmartinstarkey@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Admin user created:', admin)

  // Create default settings
  const defaultSettings = [
    { key: 'site_title', value: 'Burning Palms', category: 'general' },
    { key: 'site_description', value: 'Retro 70s inspired Australian surf and street wear. Authentic style from down under.', category: 'general' },
    { key: 'site_tagline', value: 'Retro 70s Australian Surf & Street Wear', category: 'general' },
  ]

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
      },
    })
  }

  console.log('Default settings created')

  // Create default footer widgets
  const defaultFooterWidgets = [
    {
      columnIndex: 0,
      title: null, // First column uses site title as heading (handled in component)
      type: "text",
      content: "Retro 70s inspired Australian surf and street wear. Authentic style from down under.",
      order: 0,
    },
    {
      columnIndex: 1,
      title: "SHOP",
      type: "links",
      content: JSON.stringify([
        { label: "New Arrivals", url: "#" },
        { label: "Tops", url: "#" },
        { label: "Bottoms", url: "#" },
        { label: "Accessories", url: "#" },
      ]),
      order: 0,
    },
    {
      columnIndex: 2,
      title: "INFO",
      type: "links",
      content: JSON.stringify([
        { label: "About Us", url: "#" },
        { label: "Shipping", url: "#" },
        { label: "Returns", url: "#" },
        { label: "Contact", url: "#" },
      ]),
      order: 0,
    },
    {
      columnIndex: 3,
      title: "CONNECT",
      type: "links",
      content: JSON.stringify([
        { label: "Instagram", url: "#" },
        { label: "Facebook", url: "#" },
        { label: "Newsletter", url: "#" },
      ]),
      order: 0,
    },
  ]

  // Delete existing footer widgets and create defaults
  await prisma.footerWidget.deleteMany({})
  
  for (const widget of defaultFooterWidgets) {
    await prisma.footerWidget.create({
      data: widget,
    })
  }

  console.log('Default footer widgets created')

  // Create homepage page entry
  const homepage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      content: '',
      status: 'published',
      authorId: admin.id,
      publishedAt: new Date(),
    },
  })

  console.log('Homepage page created:', homepage)

  // Create default sections for homepage (matching the existing homepage content)
  const defaultSections = [
    {
      pageId: null, // Homepage
      type: "hero",
      order: 0,
      settings: JSON.stringify({
        padding: "normal",
        spacing: "normal",
        height: "80vh",
        backgroundColor: "transparent",
        textColor: "inherit",
      }),
      content: JSON.stringify({
        title: "BURNING PALMS",
        subtitle: "Retro 70s Australian Surf & Street Wear",
      }),
      visible: true,
    },
    {
      pageId: null, // Homepage
      type: "products",
      order: 1,
      settings: JSON.stringify({
        padding: "normal",
        spacing: "normal",
        maxWidth: "full",
        backgroundColor: "transparent",
        textColor: "inherit",
      }),
      content: JSON.stringify({
        productCount: 3,
        columnsDesktop: "3",
      }),
      visible: true,
    },
    {
      pageId: null, // Homepage
      type: "about",
      order: 2,
      settings: JSON.stringify({
        padding: "normal",
        spacing: "normal",
        maxWidth: "full",
        textAlign: "center",
        backgroundColor: "transparent",
        textColor: "inherit",
      }),
      content: JSON.stringify({
        heading: "AUSTRALIAN SURF CULTURE",
        text: "Born from the beaches of Australia, Burning Palms brings you authentic surf and street wear with a retro 70s vibe. Each piece is designed to capture the essence of coastal living and laid-back style.",
      }),
      visible: true,
    },
  ]

  // Delete existing homepage sections and create defaults
  await prisma.pageSection.deleteMany({
    where: { pageId: null },
  })

  for (const section of defaultSections) {
    await prisma.pageSection.create({
      data: section,
    })
  }

  console.log('Default homepage sections created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


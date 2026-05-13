export interface ProjectContent {
  slug: string
  title: string
  serviceSlugs: string[]
  year: string
  tags: string[]
  coverImage: string
  gallery: string[]
  summary: string
  credits: string[]
}

export interface ServiceContent {
  slug: string
  title: string
  description: string
  tags: string[]
  heroImage: string
  projectSlugs: string[]
}

export const projects: ProjectContent[] = [
  {
    slug: 'caca-jewel',
    title: 'Caca Jewel',
    serviceSlugs: ['branding', 'visual-identity'],
    year: '2025',
    tags: ['Brand Strategy', 'Identity', 'Luxury Retail'],
    coverImage: '/projects/branding.png',
    gallery: ['/projects/branding.png', '/projects/identity.png'],
    summary: 'A jewelry identity system built to feel precise, premium, and contemporary across packaging, social, and retail touchpoints.',
    credits: ['Creative Direction', 'Identity System', 'Launch Assets'],
  },
  {
    slug: 'marsee',
    title: 'Marsee',
    serviceSlugs: ['visual-identity'],
    year: '2025',
    tags: ['Visual Identity', 'Campaign System', 'Digital'],
    coverImage: '/projects/identity.png',
    gallery: ['/projects/identity.png', '/projects/social.png'],
    summary: 'A visual language for Marsee focused on clarity, contrast, and strong modular assets for repeated campaign use.',
    credits: ['Art Direction', 'Identity Toolkit', 'Campaign Adaptation'],
  },
  {
    slug: 'merci-cafe',
    title: 'Merci Cafe',
    serviceSlugs: ['social-media', 'branding'],
    year: '2024',
    tags: ['Social Media', 'Content Direction', 'Cafe Brand'],
    coverImage: '/projects/social.png',
    gallery: ['/projects/social.png', '/projects/branding.png'],
    summary: 'An editorial social system for a cafe brand with a stronger visual rhythm and repeatable content structure.',
    credits: ['Content Direction', 'Social Design', 'Monthly Asset System'],
  },
  {
    slug: 'hana-cafe',
    title: 'Hana Cafe',
    serviceSlugs: ['branding', 'social-media'],
    year: '2024',
    tags: ['Branding', 'Social Media', 'Hospitality'],
    coverImage: '/projects/website.png',
    gallery: ['/projects/website.png', '/projects/social.png'],
    summary: 'A hospitality identity and content system designed to feel warm, consistent, and easy to scale across channels.',
    credits: ['Brand Refresh', 'Content Design', 'Channel Rollout'],
  },
  {
    slug: 'pulse',
    title: 'Pulse',
    serviceSlugs: ['website'],
    year: '2024',
    tags: ['Website', 'UX', 'Product Marketing'],
    coverImage: '/projects/app.png',
    gallery: ['/projects/app.png', '/projects/website.png'],
    summary: 'A website concept balancing product clarity, bold hierarchy, and lightweight storytelling for a modern digital launch.',
    credits: ['Web Design', 'UX Structure', 'Responsive System'],
  },
]

export const services: ServiceContent[] = [
  {
    slug: 'branding',
    title: 'Branding',
    description: 'Identity systems for brands that need sharper recognition, stronger consistency, and a more deliberate visual presence.',
    tags: ['Strategy', 'Identity', 'Application'],
    heroImage: '/projects/branding.png',
    projectSlugs: ['caca-jewel', 'merci-cafe', 'hana-cafe'],
  },
  {
    slug: 'visual-identity',
    title: 'Visual Identity',
    description: 'Visual systems designed for flexible rollout across campaigns, packaging, social, and digital surfaces.',
    tags: ['Identity', 'Art Direction', 'Systems'],
    heroImage: '/projects/identity.png',
    projectSlugs: ['caca-jewel', 'marsee'],
  },
  {
    slug: 'social-media',
    title: 'Social Media',
    description: 'Content direction and asset systems built for repeatable publishing without losing visual intent.',
    tags: ['Content', 'Social', 'Editorial'],
    heroImage: '/projects/social.png',
    projectSlugs: ['merci-cafe', 'hana-cafe'],
  },
  {
    slug: 'website',
    title: 'Website',
    description: 'Focused website design for brands and products that need cleaner structure, stronger hierarchy, and more convincing presentation.',
    tags: ['UX', 'UI', 'Launch'],
    heroImage: '/projects/app.png',
    projectSlugs: ['pulse'],
  },
]

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug)
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getProjectsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is ProjectContent => Boolean(project))
}

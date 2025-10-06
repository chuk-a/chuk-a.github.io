import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Chuka',
  tagline: 'The complete reference for ...',
  url: 'https://chuk-a.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'chuk-a',
  projectName: 'chuk-a.github.io',
  trailingSlash: true,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/chuk-a/chuk-a.github.io/edit/main/',
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/logo-contrast.css'),
          ],
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.5,
        },
      },
    ],
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    image: 'img/circuit-svgrepo-com.svg',
    navbar: {
      hideOnScroll: true,
      title: 'Chuka',
      logo: {
        alt: 'Site Logo',
        src: 'img/circuit-svgrepo-com.svg',
      },
      items: [
        { label: 'Get Started', to: '/get-started' },
        { label: 'Learn', to: '/learn' },
        { label: 'Build', to: '/build' },
        { label: 'Maintain', to: '/maintain' },
        {
          href: 'https://github.com/chuk-a/chuk-a.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      additionalLanguages: ['bash', 'python', 'java', 'rust', 'toml'],
    },
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark',
      },
      options: {
        maxTextSize: 50000,
      },
    },
  },
};

export default config;

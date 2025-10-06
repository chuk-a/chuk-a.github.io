

import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const sections = [
  { title: 'Getting Started', description: 'Install tools and build your first integration.', link: '/get-started' },
  { title: 'Network Overview', description: 'Understand your deployment environment.', link: '/network' },
  { title: 'Standards', description: 'Explore protocols and compliance models.', link: '/standards' },
  { title: 'Build', description: 'Integrate sensors, automate workflows, and deploy dashboards.', link: '/build' },
  { title: 'Maintain', description: 'Monitor, upgrade, and sustain your infrastructure.', link: '/maintain' },
];

export default function Home(): JSX.Element {
  return (
    <Layout title="IOTA Documentation" description="Discover the power of IOTA through examples, guides, and explanations.">
      <main className={styles.iotaMain}>
        <div className={styles.hero}>
          <img src="/img/CurcuitSculptureChuka1.png" alt="Circuit Sculpture by Chuka" className={styles.logo} />
          <h1 className={styles.title}>Circuit Sculptures by Chuka</h1>
          <p className={styles.subtitle}>Discover the power of Circuit Scupltures through examples, guides, and explanations.</p>
        </div>
        <div className={styles.cardGrid}>
          {sections.map(({ title, description, link }) => (
            <a key={title} href={link} className={styles.card}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{description}</p>
            </a>
          ))}
        </div>
      </main>
    </Layout>
  );
}
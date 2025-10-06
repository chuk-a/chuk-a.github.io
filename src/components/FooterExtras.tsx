import React from 'react';
import styles from './FooterExtras.module.css';
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaDiscord,
} from 'react-icons/fa';
import BinanceIcon from './BinanceIcon';

export default function FooterExtras() {
  return (
    <div className={styles.footerExtras}>



      <div className={styles.legal}>
        <p className={styles.legalText}>© {new Date().getFullYear()} Chuka. All rights reserved.</p>
        <div>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookies</a>
          <a href="/trademark">Trademark</a>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.orgInfo}>
        <div>
          <strong>Registered Address</strong><br />
          Chuka Circuit Sculpture<br />
          Ayud tower, Sukhbaatar Dist<br />
          Ulaanbaatar 16017, Mongolia
        </div>
        <div>
          <strong>Company</strong><br />
          Company No.: 3416/1234/2<br />
          Transparency Register: 500027331119-04
        </div>
        <div>
          <strong>Contact</strong><br />
          chuka@chuka.x10.mx
	  <br />976-99029760
        </div>
      </div>

      <div className={styles.social}>
        <a href="https://github.com/chuk-a" aria-label="GitHub"><FaGithub /></a>
        <a href="https://twitter.com/chuka" aria-label="Twitter"><FaTwitter /></a>
        <a href="https://linkedin.com/in/chuluunbaatar" aria-label="LinkedIn"><FaLinkedin /></a>
        <a href="https://youtube.com/@chuka" aria-label="YouTube"><FaYoutube /></a>
        <a href="https://discord.gg/chuka" aria-label="Discord"><FaDiscord /></a>
        <a href="https://www.binance.com/" aria-label="Binance" target="_blank" rel="noopener noreferrer"><BinanceIcon /></a>
      </div>
    </div>
  );
}
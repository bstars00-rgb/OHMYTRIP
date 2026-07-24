'use client';

import Link from 'next/link';
import { Flag, Camera, Users, Play } from 'lucide-react';

const COLS = [
  { title: 'Explore', links: ['Golf Packages', 'Destinations', 'Courses', 'Deals', 'Custom Trip'] },
  { title: 'Company', links: ['About OHMYGOLF', 'How it works', 'Partners', 'Careers', 'Press'] },
  { title: 'Support', links: ['Help Center', 'Booking Terms', 'Cancellation Policy', 'Contact', '24/7 Concierge'] },
];

export default function GolfFooter() {
  return (
    <footer className="g-footer">
      <div className="g-container">
        <div className="g-footer-top">
          <div className="g-footer-brand">
            <span className="g-logo g-logo-light">
              <Flag size={20} strokeWidth={2.4} /> OHMY<b>GOLF</b>
            </span>
            <p>Handpicked golf resorts, hotels and tee times in one seamless trip.</p>
            <div className="g-footer-social">
              <a href="#" aria-label="Instagram"><Camera size={18} /></a>
              <a href="#" aria-label="Facebook"><Users size={18} /></a>
              <a href="#" aria-label="YouTube"><Play size={18} /></a>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title} className="g-footer-col">
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="/golf">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="g-hr" />
        <div className="g-footer-bottom">
          <span>© 2026 OHMYGOLF — Prototype. A concept by OHMYHOTEL &amp; CO.</span>
          <span className="g-muted">Stay. Play. Discover.</span>
        </div>
      </div>
    </footer>
  );
}

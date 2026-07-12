import { useEffect } from 'react';
import { profile } from '../../data/profile';
import { AVATAR_URL } from '../../config/constants';

export default function SEOMetadata() {
  useEffect(() => {
    if (!profile) return;

    // Title
    const title = `${profile.name} — ${profile.title}`;
    document.title = title;

    // Meta descriptions
    const updateMeta = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', profile.overview.summary);
    updateMeta('author', profile.name);
    updateMeta('keywords', profile.overview.areasOfInterest.join(', '));

    // OpenGraph
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', profile.overview.summary, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:url', profile.social.portfolio, 'property');
    updateMeta('og:image', `${window.location.origin}${AVATAR_URL}`, 'property');

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', profile.overview.summary, 'name');
    updateMeta('twitter:image', `${window.location.origin}${AVATAR_URL}`, 'name');

    // Structured Data (JSON-LD)
    const jsonLdId = 'portfolio-structured-data';
    let script = document.getElementById(jsonLdId);
    if (!script) {
      script = document.createElement('script');
      script.id = jsonLdId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profile.name,
      "jobTitle": profile.title,
      "url": profile.social.portfolio,
      "sameAs": [
        profile.social.github,
        profile.social.linkedin
      ],
      "knowsAbout": profile.overview.areasOfInterest
    };
    
    script.textContent = JSON.stringify(structuredData);

  }, []);

  return null;
}

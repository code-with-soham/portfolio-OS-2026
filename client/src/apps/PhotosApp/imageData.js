import imgProfile1 from '../../assets/images/profile.jpg';
import imgProfile2 from '../../assets/images/profile 2.jpeg';
import imgProject1 from '../../assets/images/project 1.png';
import imgProject2 from '../../assets/images/project 2.png';
import imgPortfolio from '../../assets/images/portfolio.png';
import imgCert from '../../assets/images/certificate.jpeg';

export const ALBUMS = [
  { id: 'all', label: 'All Photos', icon: '🖼️' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'projects', label: 'Projects', icon: '💼' },
  { id: 'certificates', label: 'Certificates', icon: '🎓' },
  { id: 'hackathon', label: 'Hackathon', icon: '🏆' },
];

export const IMAGES = [
  { id: 1, src: imgProfile1, title: 'Profile Headshot', album: 'profile', date: '2025-05-12' },
  { id: 2, src: imgProfile2, title: 'Profile Setup', album: 'profile', date: '2025-06-01' },
  { id: 3, src: imgProject1, title: 'Project UI 1', album: 'projects', date: '2025-08-14' },
  { id: 4, src: imgProject2, title: 'Project UI 2', album: 'projects', date: '2025-09-02' },
  { id: 5, src: imgPortfolio, title: 'Portfolio Screenshot', album: 'projects', date: '2026-01-10' },
  { id: 6, src: imgCert, title: 'Web Dev Certificate', album: 'certificates', date: '2024-11-20' },
  { id: 7, src: imgProject1, title: 'Hackathon Project Demo', album: 'hackathon', date: '2025-10-15' },
];

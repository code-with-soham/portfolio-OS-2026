import React from 'react';
import { 
  BuildingRegular, 
  TrophyRegular, 
  FolderRegular,
  CodeRegular,
  PersonRegular,
  BookRegular,
  BriefcaseRegular
} from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { BookmarkBar, BookmarkItem } from '../../../components/ui/BookmarkBar';

export default function BrowserBookmarksBar() {
  const navigateTo = useBrowserStore(s => s.navigateTo);

  const bookmarks = [
    { title: 'Portfolio About', url: 'portfolio://about', icon: <PersonRegular fontSize={12} /> },
    { title: 'Projects', url: 'portfolio://projects', icon: <FolderRegular fontSize={12} /> },
    { title: 'Interview Prep', url: 'https://smart-mock-interview-prep.vercel.app/', icon: <TrophyRegular fontSize={12} /> },
    { title: 'GitHub', url: 'https://github.com/code-with-soham', icon: <CodeRegular fontSize={12} /> },
    { title: 'PortfolioOS', url: 'https://portfolio-os-2026.vercel.app/', icon: <BriefcaseRegular fontSize={12} /> },
    { title: 'CampusHub', url: 'https://campus-hub-mocha.vercel.app/', icon: <BuildingRegular fontSize={12} /> },
    { title: 'SohamPortfolio', url: 'https://soham-kundu-portfolio.vercel.app/', icon: <PersonRegular fontSize={12} /> },
    { title: 'StudentPlacementPredictor', url: 'https://code-with-soham.github.io/Student-Placement-Predictor/', icon: <TrophyRegular fontSize={12} /> },
    { title: 'SlidingPuzzle', url: 'https://code-with-soham.github.io/sliding-puzzle/', icon: <CodeRegular fontSize={12} /> },
    { title: 'React Docs', url: 'https://react.dev', icon: <BookRegular fontSize={12} /> },
  ];

  return (
    <BookmarkBar>
      {bookmarks.map((bm, i) => (
        <BookmarkItem
          key={i}
          icon={bm.icon}
          title={bm.title}
          onClick={() => navigateTo(bm.url)}
        />
      ))}
    </BookmarkBar>
  );
}

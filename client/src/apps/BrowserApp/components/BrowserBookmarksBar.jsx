import React from 'react';
import { 
  BuildingRegular, 
  TrophyRegular, 
  FolderRegular,
  CodeRegular,
  PersonRegular,
  BookRegular
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
    { title: 'Product Companies', url: 'https://www.google.com/search?q=Product+Based+Companies', icon: <BuildingRegular fontSize={12} /> },
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

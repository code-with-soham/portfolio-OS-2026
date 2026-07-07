import {
  FolderOpenRegular,
  FolderRegular,
  DocumentPdfRegular,
  ImageRegular,
  CodeRegular,
  DocumentRegular,
  BoxRegular,
  TextDescriptionRegular
} from '@fluentui/react-icons';

export default function FileIcon({ type, iconType, size = 48 }) {
  if (type === 'folder') {
    return <FolderRegular fontSize={size} color="#85C1E9" />; // Windows 11 Blue Folder
  }
  
  switch (iconType) {
    case 'pdf': return <DocumentPdfRegular fontSize={size} color="#E74C3C" />; // Red PDF
    case 'image': return <ImageRegular fontSize={size} color="#2ECC71" />; // Green Image
    case 'code': 
    case 'json':
    case 'python':
    case 'yaml':
    case 'excel':
      return <CodeRegular fontSize={size} color="#F39C12" />; // Orange/Yellow code
    case 'markdown': return <TextDescriptionRegular fontSize={size} color="#9B59B6" />; // Purple Markdown
    case 'package': return <BoxRegular fontSize={size} color="#F1C40F" />; // Yellow ZIP/Package
    case 'word': return <DocumentRegular fontSize={size} color="#2980B9" />; // Blue Word
    default: return <DocumentRegular fontSize={size} color="#BDC3C7" />; // Gray generic
  }
}

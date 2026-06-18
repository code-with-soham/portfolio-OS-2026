export const STORE_KEYS = [
  'portfolio-os-theme',
  'portfolio-os-desktop-storage',
  'portfolio-os-widget-storage',
  'portfolio-os-sound-storage',
  // Note: we might not want to backup file system if it contains too much data,
  // but let's back it up as well since it's asked.
  'portfolio-os-fs'
];

export function exportSettings() {
  const backup = {};
  STORE_KEYS.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      backup[key] = JSON.parse(data);
    }
  });

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-os-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

export function importSettings(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        let imported = false;
        
        STORE_KEYS.forEach(key => {
          if (backup[key]) {
            localStorage.setItem(key, JSON.stringify(backup[key]));
            imported = true;
          }
        });
        
        if (imported) {
          window.location.reload();
          resolve();
        } else {
          reject(new Error("Invalid backup file."));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}

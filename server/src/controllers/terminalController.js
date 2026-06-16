const getHelpCommands = (req, res) => {
  try {
    const helpText = [
      'Available interactive sandboxed PowerShell commands:',
      ' PROFILE COMMANDS:',
      '  whoami              - Display detailed developer profile card',
      '  skills              - Show technical capability ratings',
      '  specs               - Display embedded system specifications',
      '  education           - Show educational background',
      '  experience          - Display professional experience',
      '  research            - List research papers',
      '  contact             - Show contact information',
      '  profile             - Full profile overview',
      '  stats               - Portfolio statistics dashboard',
      ' EXPLORATION COMMANDS:',
      '  projects [filter]   - List projects (optional: filter by name/category)',
      '  tech [filter]       - Browse technology stack (optional: filter by name)',
      '  inspect <node_id>   - Fetch metadata of a tech node',
      '  cat_manifest        - Dump complete skills layout as JSON',
      '  diagnose            - Run comprehensive system check',
      '  trace [--source=X]  - Trace dependency connections',
      ' DATABASE COMMANDS:',
      '  sqlite3 portfolio.db "<SQL>" - Run SQL queries on projects',
      '  python run_cell.py [args]    - Execute notebook cells',
      ' FILESYSTEM COMMANDS:',
      '  ls / dir            - List directory contents',
      '  cd <dir>            - Change directory',
      '  cat <file>          - Display file contents',
      ' SYSTEM COMMANDS:',
      '  theme <name>        - Switch color theme (dracula, one-dark, monokai)',
      '  date                - Display current UTC timestamp',
      '  clear / cls         - Clear terminal history',
      '  git status          - Show virtual git status',
      '  curl <endpoint>     - Simulate API calls',
      '  secrets             - Display classified metrics',
      '  run <config>        - Execute simulation'
    ];

    res.status(200).json({ success: true, data: helpText });
  } catch (error) {
    console.error('Error fetching terminal help commands:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getHelpCommands
};

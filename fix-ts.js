const fs = require('fs');

function replaceInFile(file, search, replacement) {
  const content = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, content.replace(search, replacement));
}

// 1. AuthContext
replaceInFile('src/contexts/AuthContext.tsx', '  email: string;\n}', '  email: string;\n  displayName?: string;\n}');

// 2. ClientPortal
replaceInFile('src/pages/dashboard/ClientPortal.tsx', 'ChevronRight, ', '');
replaceInFile('src/pages/dashboard/ClientPortal.tsx', 'interface DocumentRequest {\n  id: string;', 'interface DocumentRequest {\n  id: string;\n  documentId?: string;');

// 3. Clients
replaceInFile('src/pages/dashboard/Clients.tsx', 'Plus, ', '');
replaceInFile('src/pages/dashboard/Clients.tsx', 'title="Action Required"', '');
replaceInFile('src/pages/dashboard/Clients.tsx', 'title="Verified"', '');
replaceInFile('src/pages/dashboard/Clients.tsx', 'title="Pending"', '');
replaceInFile('src/pages/dashboard/Clients.tsx', 'interface DocumentRequest {\n  id: string;', 'interface DocumentRequest {\n  id: string;\n  documentId?: string;');

// 4. Documents
replaceInFile('src/pages/dashboard/Documents.tsx', 'Download, ', '');

// 5. Settings
replaceInFile('src/pages/dashboard/Settings.tsx', 'value: string', 'value: any');

console.log("Applied TS fixes");

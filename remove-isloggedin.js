const fs = require('fs');
const glob = require('glob'); // Need to check if available, actually let's just use pure node FS since we know the paths from our previous grep.

const files = [
  "app/dashboard/voice-to-chat/page.jsx",
  "app/dashboard/visualization/page.tsx",
  "app/dashboard/resources/page.tsx",
  "app/dashboard/page.tsx",
  "app/dashboard/feedback/page.tsx",
  "app/dashboard/features/page.tsx",
  "app/dashboard/community/page.tsx",
  "app/dashboard/codeblocks/page.tsx",
  "app/dashboard/chatbot/page.tsx",
  "app/dashboard/ar/page.tsx"
];

const basePath = "d:/Projects/Projects/Lurnix/";

files.forEach(file => {
  const fullPath = basePath + file;
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Pattern to remove:
    // const isLoggedIn = localStorage.getItem("isLoggedIn")
    // if (!isLoggedIn) {
    //   router.push("/login")
    // }
    
    // We will use a regex to replace these exact lines or very similar.
    content = content.replace(/const isLoggedIn = localStorage\.getItem\("isLoggedIn"\)?;?\s*if \(!isLoggedIn\) \{\s*router\.push\("\/login"\)?;?\s*\}/g, "");
    
    fs.writeFileSync(fullPath, content);
    console.log("Cleaned:", fullPath);
  }
});

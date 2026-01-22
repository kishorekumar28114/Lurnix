// Shared data logic for community API
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "app/api/community/community_data.json");

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  }
  return { users: [], posts: [], comments: [] };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export { loadData, saveData };

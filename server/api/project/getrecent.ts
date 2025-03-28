import { db } from "~/composables/read";

function getRecentProjects(): Promise<ProjectList> {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM Projects ORDER BY id DESC LIMIT 4", (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows as ProjectList);
            }
        });
    });
}

export default defineEventHandler(() => {
    return getRecentProjects();
});
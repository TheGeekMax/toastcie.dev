import { db } from "~/composables/read";

function getAllProjects(): Promise<ProjectList> {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM Projects ORDER BY id ASC;", (err, rows) => {
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
    return getAllProjects();
});
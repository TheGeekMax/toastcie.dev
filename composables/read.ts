import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.sqlite");

// defines usefull functions to export

function getAllProjects() {
    let projects: unknown[] = [];
    db.all("SELECT * FROM Projects", (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        rows.forEach((row) => {
            projects.push(row);
        });
    });
    return projects;
}

export {db};
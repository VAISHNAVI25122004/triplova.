const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve('server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';", (err) => {
        if (err) {
            console.error('Error adding role column:', err.message);
        } else {
            console.log('Role column added successfully.');
        }
        db.close();
    });
});

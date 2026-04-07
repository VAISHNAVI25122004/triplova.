const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';", (err) => {
        if (err) {
            if (err.message.includes('duplicate column')) {
                console.log('Column role already exists.');
            } else {
                console.error('Error:', err.message);
            }
        } else {
            console.log('Role column added successfully!');
        }
        db.close();
    });
});

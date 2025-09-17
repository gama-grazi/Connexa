const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/connexa.db');
const db = new sqlite3.Database(dbPath);

module.exports = {
    run: (query, params = []) =>
        new Promise((resolve, reject) => {
            db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        }),
    get: (query, params = []) =>
        new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        }),
};

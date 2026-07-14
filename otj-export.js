const sqlite3 = require("sqlite3");
const { open } = require("sqlite");


async function connectDB() {
    return open({
        filename: "./test.db",
        driver: sqlite3.Database
    });
}


async function printLog() {
    const db = await connectDB();

    const users = await db.all(
        "SELECT * FROM users"
    );

    console.log(users);
}


printLog();


const sqlite3 = require("sqlite3");
const { open } = require("sqlite");


async function connectDB() {
    return open({
        filename: "./test.db",
        driver: sqlite3.Database
    });
}


async function main() {
    const db = await connectDB();

    const users = await db.all(
        "SELECT date, hours, description FROM otj WHERE userID = 1 ORDER BY date ASC"
    );

    console.log(users);
}


main();


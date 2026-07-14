const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function connectDB() {
    return open({
        filename: "./test.db",
        driver: sqlite3.Database
    });
}

async function submitOTJ(db, dateString, userID, hours, description) {
    await db.run(
        "INSERT INTO otj (date, userId, hours, description)"
        + `VALUES ('${dateString}', '${userID}', '${hours}', '${description}');`
    );
}

async function removeOTJ(db, otjID) {
    await db.run(`DELETE FROM otj WHERE otjID = ${otjID};`);
}

async function getOTJs(db) {
    return await db.all("SELECT * FROM otj");
}

async function getOTJsFromUser(db, userID) {
    return await db.all(`SELECT * FROM otj WHERE userID = ${userID}`);
}

async function addUser(db, name, courseID, courseStartDate) {
    db.run(
        "INSERT INTO users (name, courseID, courseStartDate)"
        + `VALUES ('${name}', '${courseID}', '${courseStartDate}');`
    )
}

async function deleteUser(db, userID) {
    db.run(`DELETE FROM users WHERE userID = ${userID};`);
}

async function getUsers(db) {
    return await db.all("SELECT * FROM users");
}

async function main() {
    const db = await connectDB();

    const users = await getOTJs(db);

    console.log(users);
}


main();


const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { hashPW, checkPW } = require("./otj-export");

async function connectDB() {
    return open({
        filename: "./test.db",
        driver: sqlite3.Database
    });
}

async function submitOTJ(db, dateString, userID, hours, description, ksbList) {
    const returnValue = await db.all(
        "INSERT INTO otj (date, userId, hours, description)"
        + `VALUES ('${dateString}', '${userID}', '${hours}', '${description}') RETURNING otjID;`
    );

    otjID = returnValue[0]["otjID"];

    // Create KSB rows
    for (const ksb of ksbList) {
        await db.run(
        "INSERT INTO ksb (otjID, ksb)"
        + `VALUES (${otjID}, '${ksb}')`
        )
    };
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

async function getKSBs(db) {
    return await db.all("SELECT * FROM ksb");
}

async function addUser(db, name, password, courseID, courseStartDate) {
    const hashedPW = await hashPW(password);

    db.run(
        "INSERT INTO users (name, courseID, courseStartDate, passwords)"
        + `VALUES ('${name}', '${courseID}', '${courseStartDate}', '${hashedPW}');`
    )
}

async function deleteUser(db, userID) {
    db.run(`DELETE FROM users WHERE userID = ${userID};`);
}

async function getUsers(db) {
    return await db.all("SELECT * FROM users");
}

// Returns true if the login was successful
async function login(name, password) {
    const db = await connectDB();

    // Find user in db
    const users = await db.all(
        `SELECT * FROM users WHERE name = '${name}'`
    );

    if (users.length < 1) {
        return -1
    }

    result = await checkPW(password, users[0]["passwords"]);

    if (result) {
        return users[0]["userID"];
    }
}

async function main() {
    const db = await connectDB();

    // await addUser(db, "Test User", "Password3", 3, "2003-08-26");
    // const foo = await login(db, "Talal Adnan", "asdf");
    // const foo = await getUsers(db);

    const foo = await getUsers(db);

    console.log(foo);
}

// main();

module.exports = { login };

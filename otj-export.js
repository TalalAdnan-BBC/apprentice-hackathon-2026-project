const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const fs = require("fs");
const bcrypt = require('bcrypt');


async function connectDB() {
    return open({
        filename: "./test.db",
        driver: sqlite3.Database
    });
}

//Get all the KSBs for an OTJ entry as a comma separated list
async function ksbList(otjID) {
    const db = await connectDB();

    const ksbLogs = await db.all(
        `SELECT ksb FROM ksb WHERE otjID = ${otjID}`
    );

    let ksbList = "";
    ksbLogs.forEach(ksb => {
        ksbList += `${ksb.ksb}, `
    });
    ksbList = ksbList.slice(0, -2);

    return(ksbList);
}


//Exports all of a users OTJ logs as a CSV under "otjLogs.csv" in chronological order
async function getCSV(userID) {
    const db = await connectDB();

    const otjLogs = await db.all(
        `SELECT date, hours, description, otjID FROM otj WHERE userID = ${userID} ORDER BY date ASC`
    );

    console.log(otjLogs);

    let csv = "Date,Description,KSBs,Hours\n";

    for (const log of otjLogs) {
        const ksbString = await ksbList(log.otjID);
        csv += `"${log.date}","${log.description}","${ksbString}","${log.hours}"\n`;
    }

    fs.writeFileSync("otjLogs.csv", csv);
}


//Gets number of OTJ hours a user has logged
async function totalHours(userID) {
    const db = await connectDB();

    const otjLogs = await db.all(
        `SELECT hours FROM otj WHERE userID = ${userID}`
    );

    let totalHours = 0;
    for (const log of otjLogs) {
        totalHours += log.hours;
    }

    return(totalHours)
}


//Gets percentage of hours done Vs. required hours for a user
async function hoursBar(userID) {
    hoursComplete = await totalHours(userID);
    const db = await connectDB();
    const userCourse = await db.get(
        `SELECT courseID FROM users WHERE userID = ${userID}`
    );
    const hourTarget = await db.get(
        `SELECT minHours FROM courses WHERE courseID = ${userCourse.courseID}`
    );
    
    return(hoursComplete/hourTarget.minHours);
}


//Gets percentage of KSBs done Vs. required for a user
async function ksbBar(userID) {
    const db = await connectDB();
    const doneKSBs = [];
    const userCourse = await db.get(
        `SELECT courseID FROM users WHERE userID = ${userID}`
    );
    const ksbCountDB = await db.get(
        `SELECT ksbCount FROM courses WHERE courseID = ${userCourse.courseID}`
    );
    const ksbsToDo = ksbCountDB.ksbCount;
    const userOTJs = await db.all(
        `SELECT otjID FROM otj WHERE userID = ${userID}`
    );
    for (const otj of userOTJs) {
        const otjKSBs = await db.all(
            `SELECT ksb FROM ksb WHERE otjID = ${otj.otjID}`
        );
        for (const singleKSB of otjKSBs) {
            if (doneKSBs.indexOf(singleKSB.ksb) === -1) doneKSBs.push(singleKSB.ksb);
        }
    }
    const ksbsDone = doneKSBs.length;
    const ksbPercent = (ksbsDone/ksbsToDo);
    return(ksbPercent);
}


//Returns hashed version of plaintext password
async function hashPW(password) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
}


// Check password is correct
// Returns True if correct
async function checkPW(password, hash) {
    return await bcrypt.compare(password, hash);
}

activeUser = 2;
// ksbBar(activeUser);
// hashPW("Password1");
// hashPW("Password2");
// hashPW("Password3");
// hashPW("Password4");


// console.log(await checkPW("Password1", "$2b$12$Jrk5iX/2Yre0nJ39qqUuWe4Ex8P7KxZ2rgmQyU67ecg57Cvqcrfye"));


async function main() {
    if (await checkPW(
        "Password1",
        "$2b$12$Jrk5iX/2Yre0nJ39qqUuWe4Ex8P7KxZ2rgmQyU67ecg57Cvqcrfye"
    )) {
        console.log("Login successful");
    } else {
        console.log("Incorrect username or password");
    }
}

// main();

module.exports = { checkPW }

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const fs = require("fs");


async function connectDB() {
    return open({
        filename: "./test.db",
        driver: sqlite3.Database
    });
}


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

activeUser = 2;
ksbBar(activeUser);
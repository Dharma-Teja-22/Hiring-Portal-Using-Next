import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "../../../config/db"

export async function POST(request) {
  try {
    const data = await request.json();
    const manager_id = data.manager_id;
    if (new Date(data.application_deadline) > new Date()) {
      const sql = `INSERT INTO jobs (title, description, salary, location, job_type, experience_level, skills, application_deadline, manager_id) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await new Promise((resolve, reject) => {
        db.query(
          sql,
          [
            data.title,
            data.description,
            data.salary,
            data.location,
            data.job_type,
            data.experience_level,
            data.skills,
            new Date(data.application_deadline),
            manager_id,
          ],
          (err, res) => {
            if (err) {
                console.log(err, "from Routes")
              reject(err);
            } else {
                console.log(res, "from Routes")
              resolve(res);
            }
          }
        );
      });

      return NextResponse.json(
        { message: "Successfully Job Posted" },
        { status: StatusCodes.OK }
      );
    } 
    else {
      console.log("Check date once It's in past!");
      return NextResponse.json(
        { message: "Date is in the past!" },
        { status: StatusCodes.ACCEPTED }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Duplicate entry found" },
      { status: StatusCodes.CONFLICT }
    );
  }
}


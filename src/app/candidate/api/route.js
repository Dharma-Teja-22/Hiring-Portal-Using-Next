import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "../../../config/db";

// Candidate Fetch All Posted Jobs
export async function GET(request) {
  try {
    const sql = `SELECT job_id, title, salary, location, job_type, experience_level, skills, status, application_deadline FROM jobs`;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, (err, res) => {
        if (err) {
          console.log(err, "from Routes");
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return NextResponse.json(
      { status: StatusCodes.OK, msg: result },
      { status: StatusCodes.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "An error occurred" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

//Apply for job
export async function POST(request) {
  const data = await request.json();
  try {
    const sql = `INSERT INTO applications (candidate_id, job_id, resume_url, application_date) VALUES (?, ?, ?, ?)`;
    await new Promise((resolve, reject) => {
      db.query(
        sql,
        [data.candidate_id, data.job_id, data.resume_url, new Date()],
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        }
      );
    });

    return NextResponse.json(
      {
        status: StatusCodes.OK,
        msg: "Successfully Candidate Applied for Job.",
      },
      { status: StatusCodes.OK }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Duplicate entry found" },
      { status: StatusCodes.CONFLICT }
    );
  }
}

//Applied Jobs
export async function PUT(request) {
  try {
    const data = await request.json();
    
    const candidate_id = data.candidate_id;
    const sql = `
          SELECT  j.job_id, j.title, j.description, j.salary, j.location, j.job_type, j.application_deadline, a.status
                FROM jobs j 
                JOIN applications a 
                ON j.job_id = a.job_id 
                AND a.candidate_id = ?`;

    const jobs = await new Promise((resolve, reject) => {
      db.query(sql, [candidate_id], (err, result) => {
        if (err) {
          console.log(err, "from Routes");
          reject(err);
        } else {
          console.log(result, "from Routes");
          resolve(result);
        }
      });
    });

    if (jobs.length != 0) {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: jobs },
        { status: StatusCodes.OK }
      );
    } 
    else {
      return NextResponse.json(
        {
          status: StatusCodes.NOT_FOUND,
          msg: "Not yet applied for jobs.",
        },
        { status: StatusCodes.NOT_FOUND }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "An error occurred while fetching candidate job info." },
      { status: StatusCodes.CONFLICT }
    );
  }
}

//Interview Status Check
export async function PATCH(request) {
  try {
    const data = await request.json(); // Ensure to await the promise to get JSON
    console.log(data, "From the frontend");

    // Check for required fields
    if (!data.candidate_id || !data.job_id) {
      return NextResponse.json(
        { message: "Candidate ID and Job ID are required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const sql = `SELECT interview_date, Duration, interview_result FROM interviews WHERE candidate_id = ? AND job_id = ?`;
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [data.candidate_id, data.job_id], (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Not Assigned with Interview Date" },
        { status: StatusCodes.NOT_FOUND } // Use NOT_FOUND for clarity
      );
    }

    const interviewStatus = result[0];

    if (
      interviewStatus.interview_result === "Pending" ||
      interviewStatus.interview_result === "Selected"
    ) {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: interviewStatus },
        { status: StatusCodes.OK }
      );
    } else {
      return NextResponse.json(
        { message: "Not Assigned with Interview Date" },
        { status: StatusCodes.OK }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Candidate is not yet assigned with the result!" },
      { status: StatusCodes.CONFLICT }
    );
  }
}

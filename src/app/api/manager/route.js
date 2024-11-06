import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "../../../config/db";
import jwt from 'jsonwebtoken'; 


// Function for JWT Verification
async function verify(request)
{
    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) 
    {
      return NextResponse.json(
        { message: "No token provided." },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const manager_id = decoded.id;
    return manager_id;
}

//Manager Post Jobs
export async function POST(request) {
  try {
    const manager_id = verify(request);

    const data = await request.json();
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
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });

      return NextResponse.json(
        { message: "Successfully Job Posted" },
        { status: StatusCodes.OK }
      );
    } else {
      console.log("Check date once It's in past!");
      return NextResponse.json(
        { message: "Date is in the past!" },
        { status: StatusCodes.ACCEPTED }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Duplicate entry found" },
      { status: StatusCodes.CONFLICT }
    );
  }
}

//Get Candidates under Specific Manager
export async function GET(request) {
  try {
    const manager_id = verify(request);
    const sql = `
        SELECT c.*, a.job_id, j.title, a.status, a.resume_url
        FROM candidates c 
        JOIN applications a ON c.candidate_id = a.candidate_id 
        JOIN jobs j ON a.job_id = j.job_id 
        WHERE j.manager_id = ?`;

    const candidates = await new Promise((resolve, reject) => {
      db.query(sql, [manager_id], (err, result) => {
        if (err) {
        //   console.log(err, "from Routes");
          reject(err);
        } else {
        //   console.log(result, "from Routes");
          resolve(result);
        }
      });
    });

    if (candidates.length) {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: candidates },
        { status: StatusCodes.OK }
      );
    } else {
      return NextResponse.json(
        {
          status: StatusCodes.NOT_FOUND,
          msg: "Candidate details not found for the given manager_id.",
        },
        { status: StatusCodes.NOT_FOUND }
      );
    }
  } 
  catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "An error occurred while fetching candidate info." },
      { status: StatusCodes.CONFLICT }
    );
  }
}

//User Profile
export async function PATCH(request) {
  const data = await request.json();
  if (!data.candidate_id || !data.job_id) {
    return NextResponse.json(
      { message: "Candidate ID and Job ID are required." },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  try {
    const sql = `
        SELECT c.first_name, c.last_name, c.email, a.resume_url, a.status
        FROM candidates c
        JOIN applications a ON c.candidate_id = ? AND a.job_id = ?`;

    const candidates = await new Promise((resolve, reject) => {
      db.query(sql, [data.candidate_id, data.job_id], (err, result) => {
        if (err) {
          console.error(err, "from Routes");
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (candidates.length) {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: candidates[0] },
        { status: StatusCodes.OK }
      );
    } else {
      return NextResponse.json(
        {
          status: StatusCodes.NOT_FOUND,
          msg: "Candidate details not found for the given candidateId and jobId.",
        },
        { status: StatusCodes.NOT_FOUND }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "An error occurred while fetching candidate info." },
      { status: StatusCodes.CONFLICT }
    );
  }
}

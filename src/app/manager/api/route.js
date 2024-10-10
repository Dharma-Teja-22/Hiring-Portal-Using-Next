import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "../../../config/db";

//Manager Post Jobs
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
              console.log(err, "from Routes");
              reject(err);
            } else {
              console.log(res, "from Routes");
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
export async function PUT(request) {
  try {
    const data = await request.json();
    const manager_id = data.manager_id;
    const sql = `
        SELECT c.*, a.job_id, j.title, a.status, a.resume_url
        FROM candidates c 
        JOIN applications a ON c.candidate_id = a.candidate_id 
        JOIN jobs j ON a.job_id = j.job_id 
        WHERE j.manager_id = ?`;

    const candidates = await new Promise((resolve, reject) => {
      db.query(sql, [manager_id], (err, result) => {
        if (err) {
          console.log(err, "from Routes");
          reject(err);
        } else {
          console.log(result, "from Routes");
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
  } catch (err) {
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

//Update Status
export async function GET(request) {
  const data = await request.json();
  
  if (!data.candidate_id || !data.job_id || !data.manager_id || !data.status) {
    return NextResponse.json(
      { message: "Candidate ID, Job ID, Manager ID, and Status are required." },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  
  try {
    // Check application deadline
    const sql = `
      SELECT application_deadline FROM ${config.TABLENAME3} 
      WHERE job_id = ? AND manager_id = ?`;
    
    const [deadline] = await new Promise((resolve, reject) => {
      db.query(sql, [data.job_id, data.manager_id], (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (!deadline.length || new Date(deadline[0].application_deadline) >= new Date()) {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: "Still posts are not closed!" },
        { status: StatusCodes.OK }
      );
    }

    // Check application status
    const statusQuery = `
      SELECT a.status, a.application_id 
      FROM applications a 
      JOIN jobs j ON a.job_id = ? 
      WHERE j.manager_id = ? AND a.candidate_id = ?`;

    const [status] = await new Promise((resolve, reject) => {
      db.query(statusQuery, [data.job_id, data.manager_id, data.candidate_id], (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (!status.length) {
      return NextResponse.json(
        { status: StatusCodes.NOT_FOUND, msg: "No application found for this candidate." },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    if (status[0].status === "Pending") {
      const updateQuery = `
        UPDATE applications 
        SET status = ? 
        WHERE application_id = ? AND job_id = ?`;

      await new Promise((resolve, reject) => {
        db.query(updateQuery, [data.status, status[0].application_id, data.job_id], (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      return NextResponse.json(
        { status: StatusCodes.OK, msg: `Successfully updated the 'Pending' state to '${data.status}' state` },
        { status: StatusCodes.OK }
      );
    } else if (status[0].status === "Interview") {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: "Status already is in Interview State" },
        { status: StatusCodes.OK }
      );
    } else {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: "Status already Rejected" },
        { status: StatusCodes.OK }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error while updating the data." },
      { status: StatusCodes.CONFLICT }
    );
  }
}

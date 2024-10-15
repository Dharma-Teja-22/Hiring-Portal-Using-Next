import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "../../../../config/db";

//Update Status
export async function PATCH(request) {
  const data = await request.json();
  console.log(data);

  if (!data.candidate_id || !data.job_id || !data.manager_id || !data.status) {
    return NextResponse.json(
      { message: "Candidate ID, Job ID, Manager ID, and Status are required." },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    // Check application deadline
    const sql = `
          SELECT application_deadline FROM jobs
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

    // Ensure the deadline exists
    if (!deadline) {
      return NextResponse.json(
        { status: StatusCodes.NOT_FOUND, msg: "Job not found." },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const currentDate = new Date();
    const applicationDeadline = new Date(deadline.application_deadline);

    // console.log(applicationDeadline >= currentDate, "Comparing deadlines");

    if (applicationDeadline >= currentDate) {
      return NextResponse.json(
        { status: StatusCodes.OK, msg: "Applications are still open." },
        { status: StatusCodes.OK }
      );
    }

    // Check application status
    else {
      const statusQuery = `
          SELECT a.status, a.application_id 
          FROM applications a 
          JOIN jobs j ON a.job_id = ? 
          WHERE j.manager_id = ? AND a.candidate_id = ?`;

      const [status] = await new Promise((resolve, reject) => {
        db.query(
          statusQuery,
          [data.job_id, data.manager_id, data.candidate_id],
          (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (status === null) {
        return NextResponse.json(
          {
            status: StatusCodes.NOT_FOUND,
            msg: "No application found for this candidate.",
          },
          { status: StatusCodes.NOT_FOUND }
        );
      }

      console.log(status, "Application status from API");

      if (status.status === "Pending") {
        const updateQuery = `
            UPDATE applications 
            SET status = ? 
            WHERE application_id = ? AND job_id = ?`;

        await new Promise((resolve, reject) => {
          db.query(
            updateQuery,
            [data.status, status.application_id, data.job_id],
            (err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });

        return NextResponse.json(
          {
            status: StatusCodes.OK,
            msg: `Successfully updated the 'Pending' state to '${data.status}' state`,
          },
          { status: StatusCodes.OK }
        );
      } else if (status[0].status === "Interview") {
        return NextResponse.json(
          {
            status: StatusCodes.OK,
            msg: "Status is already in Interview State",
          },
          { status: StatusCodes.OK }
        );
      } else {
        return NextResponse.json(
          { status: StatusCodes.OK, msg: "Status is already Rejected" },
          { status: StatusCodes.OK }
        );
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error while updating the data." },
      { status: StatusCodes.CONFLICT }
    );
  }
}

//Update Interview Date
export async function POST(request) {
  try {
    const data = await request.json();
    const applicationId = await new Promise((resolve, reject) => {
      const sql = `SELECT application_id, status FROM applications WHERE job_id = ? AND candidate_id = ?`;
      db.query(sql, [data.job_id, data.candidate_id], (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (applicationId.length > 0 && applicationId[0].status === "Interview") {
      const sql = `INSERT INTO interviews (application_id, job_id, candidate_id, interview_date) VALUES (?, ?, ?, ?)`;
      await new Promise((resolve, reject) => {
        db.query(
          sql,
          [
            applicationId[0].application_id,
            data.job_id,
            data.candidate_id,
            new Date(data.interview_date),
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      return NextResponse.json(
        {
          msg: "Successfully The candidate is assigned with an interview date and time",
        },
        { status: StatusCodes.OK }
      );
    } else {
      console.log(
        "Cannot assign the interview date and time for the candidate."
      );
      return NextResponse.json(
        {
          msg: "Assigning interview to the candidate is unsuccessful. Reason: he is not selected for the 'Interview'",
        },
        { status: StatusCodes.CONFLICT }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "Duplicate entry found" },
      { status: StatusCodes.CONFLICT }
    );
  }
}


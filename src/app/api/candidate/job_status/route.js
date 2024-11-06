import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "../../../../config/db";

//Checking Job Status
export async function POST(request) {
    const data = await request.json();    
    try {
      const sql = `SELECT status FROM applications WHERE candidate_id = ? AND job_id = ?`;
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
          { message: "Status Not Found" },
          { status: StatusCodes.NOT_FOUND }
        );
      }
      const jobStatus = result[0].status;
  
      if (jobStatus === "Pending") {
        return NextResponse.json(
          { status: StatusCodes.OK, msg: "Pending" },
          { status: StatusCodes.OK }
        );
      } else if (["Interview", "In-Progress", "Selected"].includes(jobStatus)) {
        return NextResponse.json(
          { status: StatusCodes.OK, msg: jobStatus },
          { status: StatusCodes.OK }
        );
      } else {
        console.log("Application is Rejected!");
        return NextResponse.json(
          { status: StatusCodes.OK, msg: "Rejected" },
          { status: StatusCodes.OK }
        );
      }
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { message: "Status Not Found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }
  }
  
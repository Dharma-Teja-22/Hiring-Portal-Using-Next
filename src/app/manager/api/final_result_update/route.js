import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "../../../../config/db";
import nodemailer from "nodemailer";

//Candidate Info for Updating Final Result
export async function POST(request) {
  try {
    const data = await request.json();
    // Fetch candidate information for interview
    const sql = `
          SELECT c.*, a.job_id, j.title, a.status, i.interview_date, i.interview_result
          FROM candidates c 
          JOIN applications a ON c.candidate_id = a.candidate_id 
          JOIN jobs j ON a.job_id = j.job_id 
          JOIN interviews i ON i.job_id = j.job_id AND i.candidate_id = c.candidate_id
          WHERE j.manager_id = ?`;

    const candidates = await new Promise((resolve, reject) => {
      db.query(sql, [data.manager_id], (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (candidates.length > 0) {
      return NextResponse.json({ msg: candidates }, { status: StatusCodes.OK });
    } else {
      return NextResponse.json(
        { msg: "Candidate details not found for the given manager_id." },
        { status: StatusCodes.NOT_FOUND }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "An error occurred while fetching candidate information." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

//Update End Result
export async function PUT(request) {
  const data = await request.json();
  const sendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pythoncourse.143@gmail.com",
        pass: "iyft esdo ffee sngk",
      },
    });

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email sending failed"); // Throw error to handle it in the main flow
    }
  };

  try {
    const sqlCheck = `SELECT interview_date, interview_result FROM interviews WHERE job_id = ? AND candidate_id = ?`;
    const interviewData = await new Promise((resolve, reject) => {
      db.query(sqlCheck, [data.job_id, data.candidate_id], (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (interviewData.length > 0) {
      if (interviewData[0].interview_result === "Pending") {
        if (new Date(interviewData[0].interview_date) < new Date()) {
          const sqlUpdate = `UPDATE interviews SET interview_result = ? WHERE job_id = ? AND candidate_id = ?`;
          const result = await new Promise((resolve, reject) => {
            db.query(
              sqlUpdate,
              [data.interview_result, data.job_id, data.candidate_id],
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

          if (result) {
            const mailOptions = {
              to: data.email,
              subject: "Interview Result Update",
              html: data.interview_result === "Selected"
                ? `<html lang="en">
                    <head>
                        <title>Interview Selection Mail</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 1; padding: 0;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #4CAF50; font-size: 24px; text-align: center; margin-bottom: 20px;">🎉🎉 You're ${data.interview_result} for ${data.title}!</h1>
                            <hr style="border: none; border-top: 2px solid #4CAF50; margin: 20px 0;">
                          

                            <!-- Progress Tracker -->
                            <h3 style="color: #333; font-size: 18px; margin-top: 20px; text-align: center;">Your Progress ✔️</h3>
                            <ul style="list-style-type: none; padding-left: 0; margin-top: 20px;">
                                <li style="font-size: 16px; color: #333; margin-bottom: 10px;">
                                    ✔️ <b>Resume Selection</b> 
                                </li>
                                <li style="font-size: 16px; color: #333; margin-bottom: 10px;">
                                    ✔️ <b>Interview</b> 
                                </li>
                                <li style="font-size: 16px; color: #333; margin-bottom: 10px;">
                                    ✔️  <b>Final Result:</b> <span style="color: #4CAF50;">Selected</span>
                                </li>
                            </ul>

                            <p style="color: #0a41f7ee; font-size: 14px; padding-left: 6px; text-align: center;">🌟 All the Best! 🌟</p>

                            <footer style="text-align: center; margin-top: 20px; font-size: 13px; color: #3d3636;">
                                This is an automated email, please do not reply.
                            </footer>
                        </div>
                    </body>
                    </html>`
                    :
                    `<html lang="en">
                    <head>
                        <title>Interview Selection Mail</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 1; padding: 0;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #4CAF50; font-size: 24px; text-align: center; margin-bottom: 20px;"> You're ${data.interview_result} for ${data.title}!</h1>
                            <hr style="border: none; border-top: 2px solid #4CAF50; margin: 20px 0;">
                          

                            <!-- Progress Tracker -->
                            <h3 style="color: #333; font-size: 18px; margin-top: 20px; text-align: center;">Your Progress ✔️</h3>
                            <ul style="list-style-type: none; padding-left: 0; margin-top: 20px;">
                                <li style="font-size: 16px; color: #333; margin-bottom: 10px;">
                                    ✔️ <b>Resume Selection</b> 
                                </li>
                                <li style="font-size: 16px; color: #333; margin-bottom: 10px;">
                                    ✔️ <b>Interview</b> 
                                </li>
                                <li style="font-size: 16px; color: #333; margin-bottom: 10px;">
                                    ⏳ <b>Final Result:</b> <span style="color: #4CAF50;">${data.interview_result}</span>
                                </li>
                            </ul>

                            <p style="color: #0a41f7ee; font-size: 14px; padding-left: 6px; text-align: center;">🌟 Better luck next time  🌟</p>

                            <footer style="text-align: center; margin-top: 20px; font-size: 13px; color: #3d3636;">
                                This is an automated email, please do not reply.
                            </footer>
                        </div>
                    </body>
                    </html>`,
            };

            // Send the email
            await sendEmail(mailOptions);

            return NextResponse.json(
              { msg: "Successfully updated the interview result and sent an email" },
              { status: StatusCodes.OK }
            );
          } else {
            return NextResponse.json(
              { msg: "Failed to update interview result." },
              { status: StatusCodes.BAD_REQUEST }
            );
          }
        } else {
          return NextResponse.json(
            { msg: "Interview date is in the past." },
            { status: StatusCodes.BAD_REQUEST }
          );
        }
      } else {
        return NextResponse.json(
          { msg: "Interview result already updated." },
          { status: StatusCodes.CONFLICT }
        );
      }
    } else {
      return NextResponse.json(
        { msg: "Interview not found." },
        { status: StatusCodes.NOT_FOUND }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "Error updating the interview result." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

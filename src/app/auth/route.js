import { NextResponse } from "next/server";
import db from "../../config/db";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes"

//For Sign-up
export async function POST(request) {
  try {
    const { first_name, last_name, email, password, role } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUser = (table) => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO ${table} (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`,
          [first_name, last_name, email, hashedPassword],
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
        );
      });
    };

    if (role === "Manager") {
      await insertUser("managers");
    } else if (role === "Candidate") {
      await insertUser("candidates");
    } else {
      return NextResponse.json(
        { message: "Role is not defined" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User added successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

//For Sign-in
export async function PUT(request) {
  try {
    const data = await request.json();
    const findUser = (table, email) => {
      return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ${table} WHERE email = ?`;
        db.query(sql, [email], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });
    };

    let user;
    if (data.role === "Manager") {
      user = await findUser("managers", data.email);
    } else if (data.role === "Candidate") {
      user = await findUser("candidates", data.email);
    } else {
      return NextResponse.json(
        { message: "Role is not defined" },
        { status: 400 }
      );
    }

    if (user) {
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid Credentials." },
          { status: StatusCodes.FORBIDDEN }
        );
      }

      const token = sign({ id: user.manager_id || user.candidate_id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      return NextResponse.json({
        status:  200,
        msg: {
          id: user.manager_id || user.candidate_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          token,
        },
      });
    } 

    else {
      return NextResponse.json(
        { message: "Invalid Credentials." },
        { status: StatusCodes.FORBIDDEN }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


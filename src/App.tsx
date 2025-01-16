"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.css";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
} from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCJ7Qp_JV-Gs0bLgBkri4p47UVfDVLzlw",
  authDomain: "attendance-report-system-d35c1.firebaseapp.com",
  databaseURL:
    "https://attendance-report-system-d35c1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "attendance-report-system-d35c1",
  storageBucket: "attendance-report-system-d35c1.firebasestorage.app",
  messagingSenderId: "478481789967",
  appId: "1:478481789967:web:a93a6168f6d0003ae41f7a",
  measurementId: "G-1XX9HTHJB6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Types
type Employee = {
  id: string;
  name: string;
};

type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  breakOut: string;
  breakIn: string;
  checkOut: string;
  status: "Present" | "MC" | "AL" | "Other";
  remarks: string;
};

type LeaveType = "AL" | "MC" | "Other" | string;

type LeaveRecord = {
  id: string;
  employeeId: string;
  date: string;
  type: LeaveType;
  reason: string;
};

// Components
const AttendanceForm: React.FC<{
  onSubmit: (data: Omit<AttendanceRecord, "id">) => void;
  employees: Employee[];
  leaveTypes: LeaveType[];
}> = ({ onSubmit, employees, leaveTypes }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [breakOut, setBreakOut] = useState("");
  const [breakIn, setBreakIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState<"Present" | "MC" | "AL" | "Other">(
    "Present"
  );
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      employeeId,
      date,
      checkIn,
      breakOut,
      breakIn,
      checkOut,
      status,
      remarks,
    });
    // Reset form fields
    setEmployeeId("");
    setDate("");
    setCheckIn("");
    setBreakOut("");
    setBreakIn("");
    setCheckOut("");
    setStatus("Present");
    setRemarks("");
  };

  return (
    <form onSubmit={handleSubmit} className={"form"}>
      <div className={"formGroup"}>
        <label htmlFor="employee">Employee:</label>
        <select
          id="employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div className={"formGroup"}>
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className={"formGroup"}>
        <label htmlFor="checkIn">Check In:</label>
        <input
          id="checkIn"
          type="time"
          step="1"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
      </div>
      <div className={"formGroup"}>
        <label htmlFor="breakOut">Break Out:</label>
        <input
          id="breakOut"
          type="time"
          step="1"
          value={breakOut}
          onChange={(e) => setBreakOut(e.target.value)}
        />
      </div>
      <div className={"formGroup"}>
        <label htmlFor="breakIn">Break In:</label>
        <input
          id="breakIn"
          type="time"
          step="1"
          value={breakIn}
          onChange={(e) => setBreakIn(e.target.value)}
        />
      </div>
      <div className={"formGroup"}>
        <label htmlFor="checkOut">Check Out:</label>
        <input
          id="checkOut"
          type="time"
          step="1"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </div>
      <div className={"formGroup"}>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "Present" | "MC" | "AL" | "Other")
          }
          required
        >
          <option value="Present">Present</option>
          {leaveTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className={"formGroup"}>
        <label htmlFor="remarks">Remarks:</label>
        <input
          id="remarks"
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Any comments"
        />
      </div>
      <button type="submit">Log Attendance</button>
    </form>
  );
};

const LeaveForm: React.FC<{
  onSubmit: (data: Omit<LeaveRecord, "id">) => void;
  employees: Employee[];
  leaveTypes: LeaveType[];
}> = ({ onSubmit, employees, leaveTypes }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<LeaveType>("AL");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ employeeId, date, type, reason });
    // Reset form fields
    setEmployeeId("");
    setDate("");
    setType("AL");
    setReason("");
  };

  return (
    <form onSubmit={handleSubmit} className={"form"}>
      <div className={"formGroup"}>
        <label htmlFor="leaveEmployee">Employee:</label>
        <select
          id="leaveEmployee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <div className={"formGroup"}>
        <label htmlFor="leaveDate">Date:</label>
        <input
          id="leaveDate"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className={"formGroup"}>
        <label htmlFor="leaveType">Leave Type:</label>
        <select
          id="leaveType"
          value={type}
          onChange={(e) => setType(e.target.value as LeaveType)}
          required
        >
          {leaveTypes.map((leaveType) => (
            <option key={leaveType} value={leaveType}>
              {leaveType}
            </option>
          ))}
        </select>
      </div>
      <div className={"formGroup"}>
        <label htmlFor="leaveReason">Reason:</label>
        <input
          id="leaveReason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
          required
        />
      </div>
      <button type="submit">Record Leave</button>
    </form>
  );
};

export default function HRAttendanceSystem() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    "AL",
    "MC",
    "Other",
  ]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newLeaveType, setNewLeaveType] = useState("");
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch employees
    const employeesRef = ref(database, "employees");
    onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      const employeeList: Employee[] = [];
      for (let id in data) {
        employeeList.push({ id, name: data[id].name });
      }
      setEmployees(employeeList);
    });

    // Fetch leave types
    const leaveTypesRef = ref(database, "leaveTypes");
    onValue(leaveTypesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLeaveTypes(Object.values(data));
      }
    });

    // Fetch attendance records
    const attendanceRef = ref(database, "attendance");
    onValue(attendanceRef, (snapshot) => {
      const data = snapshot.val();
      const recordList: AttendanceRecord[] = [];
      for (let id in data) {
        recordList.push({ id, ...data[id] });
      }
      setAttendanceRecords(recordList);
    });

    // Fetch leave records
    const leaveRef = ref(database, "leave");
    onValue(leaveRef, (snapshot) => {
      const data = snapshot.val();
      const recordList: LeaveRecord[] = [];
      for (let id in data) {
        recordList.push({ id, ...data[id] });
      }
      setLeaveRecords(recordList);
    });
  }, []);

  const handleAttendanceSubmit = (data: Omit<AttendanceRecord, "id">) => {
    const newAttendanceRef = push(ref(database, "attendance"));
    set(newAttendanceRef, data);
  };

  const handleLeaveSubmit = (data: Omit<LeaveRecord, "id">) => {
    const newLeaveRef = push(ref(database, "leave"));
    set(newLeaveRef, data);
  };

  const handleAddEmployee = () => {
    if (newEmployeeName.trim()) {
      const newEmployeeRef = push(ref(database, "employees"));
      set(newEmployeeRef, { name: newEmployeeName.trim() });
      setNewEmployeeName("");
    }
  };

  const handleAddLeaveType = () => {
    if (newLeaveType.trim() && !leaveTypes.includes(newLeaveType.trim())) {
      const newLeaveTypeRef = push(ref(database, "leaveTypes"));
      set(newLeaveTypeRef, newLeaveType.trim());
      setNewLeaveType("");
    }
  };

  const handlePrint = () => {
    const printContent = printableRef.current;
    const windowPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );

    if (printContent && windowPrint) {
      windowPrint.document.write(printContent.innerHTML);
      windowPrint.document.close();
      windowPrint.focus();
      windowPrint.print();
      windowPrint.close();
    }
  };

  const calculateWorkingHours = (record: AttendanceRecord): string => {
    const checkIn = new Date(`2000-01-01T${record.checkIn}`);
    const checkOut = new Date(`2000-01-01T${record.checkOut}`);
    let breakTime = 0;

    if (record.breakOut && record.breakIn) {
      const breakOut = new Date(`2000-01-01T${record.breakOut}`);
      const breakIn = new Date(`2000-01-01T${record.breakIn}`);
      breakTime = (breakIn.getTime() - breakOut.getTime()) / 1000 / 3600;
    }

    const totalHours = (checkOut.getTime() - checkIn.getTime()) / 1000 / 3600;
    const workingHours = totalHours - breakTime;

    return workingHours.toFixed(2);
  };

  const handleRemoveAttendanceRecord = (id: string) => {
    remove(ref(database, `attendance/${id}`));
  };

  const handleRemoveLeaveRecord = (id: string) => {
    remove(ref(database, `leave/${id}`));
  };

  useEffect(() => {
    document.body.classList.add("loaded");
  }, []);

  return (
    <div className={"app"}>
      <header className={"header"}>
        <h1>HR Attendance System</h1>
      </header>

      <main className={styles.main}>
        <section className={`${styles.section} ${styles.attendanceSection}`}>
          <h2>Log Attendance</h2>
          <AttendanceForm
            onSubmit={handleAttendanceSubmit}
            employees={employees}
            leaveTypes={leaveTypes}
          />
        </section>

        <section className={`${styles.section} ${styles.leaveSection}`}>
          <h2>Record Leave</h2>
          <LeaveForm
            onSubmit={handleLeaveSubmit}
            employees={employees}
            leaveTypes={leaveTypes}
          />
        </section>

        <section className={`${styles.section} ${styles.employeeSection}`}>
          <h2>Add New Employee</h2>
          <div className={styles.formGroup}>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Enter new employee name"
            />
            <button onClick={handleAddEmployee}>Add Employee</button>
          </div>
        </section>

        <section className={`${styles.section} ${styles.leaveTypeSection}`}>
          <h2>Add New Leave Type</h2>
          <div className={styles.formGroup}>
            <input
              type="text"
              value={newLeaveType}
              onChange={(e) => setNewLeaveType(e.target.value)}
              placeholder="Enter new leave type"
            />
            <button onClick={handleAddLeaveType}>Add Leave Type</button>
          </div>
        </section>

        <section className={`${styles.section} ${styles.reportsSection}`}>
          <h2>Reports</h2>
          <button onClick={handlePrint} className={styles.printButton}>
            Print Records
          </button>
        </section>

        <div ref={printableRef}>
          <section
            className={`${styles.section} ${styles.attendanceReportSection}`}
          >
            <h2>Attendance Report</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Timetable</th>
                    <th>Check In</th>
                    <th>Break Out</th>
                    <th>Break In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Working Hours</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => {
                    const employee = employees.find(
                      (e) => e.id === record.employeeId
                    );
                    return (
                      <tr key={record.id}>
                        <td>{employee ? employee.name : "Unknown"}</td>
                        <td>{record.date}</td>
                        <td>9:00 AM - 6:00 PM</td>
                        <td>{record.checkIn}</td>
                        <td>{record.breakOut || "-"}</td>
                        <td>{record.breakIn || "-"}</td>
                        <td>{record.checkOut}</td>
                        <td>{record.status}</td>
                        <td>{record.remarks}</td>
                        <td>{calculateWorkingHours(record)}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleRemoveAttendanceRecord(record.id)
                            }
                            className={styles.removeButton}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${styles.section} ${styles.leaveReportSection}`}>
            <h2>Leave Report</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRecords.map((record) => {
                    const employee = employees.find(
                      (e) => e.id === record.employeeId
                    );
                    return (
                      <tr key={record.id}>
                        <td>{employee ? employee.name : "Unknown"}</td>
                        <td>{record.date}</td>
                        <td>{record.type}</td>
                        <td>{record.reason}</td>
                        <td>
                          <button
                            onClick={() => handleRemoveLeaveRecord(record.id)}
                            className={styles.removeButton}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

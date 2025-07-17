import { createSlice } from "@reduxjs/toolkit";

interface IStudent {
  id: string;
  dates: string[];
}

interface IStudentsState {
  students: IStudent[];
}

const initialState: IStudentsState = {
  students: [],
};

const checkAttendanceSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudent: (state, action) => {
      const { id, date } = action.payload;
      const existingStudent = state.students.find((s) => s.id === id);

      if (existingStudent) {
        if (!existingStudent.dates.includes(date)) {
          existingStudent.dates.push(date);
        }
      } else {
        state.students = [...state.students, { id, dates: [date] }];
      }
    },
    removeDate: (state, action) => {
      const { id, date } = action.payload;
      const student = state.students.find((s) => s.id === id);
      if (student) {
        student.dates = student.dates.filter((d) => d !== date);
      }
    },
    clearStudentData: () => initialState,
  },
});

export const { setStudent, removeDate, clearStudentData } =
  checkAttendanceSlice.actions;

export default checkAttendanceSlice.reducer;

export const getStudents = (state: { checkAttendance: IStudentsState }) =>
  state.checkAttendance.students;

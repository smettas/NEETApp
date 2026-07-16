import Papa from "papaparse";

const SPREADSHEET_ID = "1M9DoIy1F7yG_p6A3T1TE8vTi2NqUhbZXkSYMz6KLY6s";

const SHEET_IDS = {
  weekly: "249744697",
  pcb: "1890134223",
  pcm: "1860630488",
  theory: "693298185",
  settings: "326630517",
  chapters: "REPLACE_WITH_CHAPTERS_TAB_GID",
  topics: "REPLACE_WITH_TOPICS_TAB_GID",
  syllabus11: "1240992647",
  syllabus12: "1502011525",
};

const getSheetUrl = (gid) =>
  `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;

const fetchSheet = async (gid) => {
  try {
    const response = await fetch(getSheetUrl(gid));

    const csv = await response.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    return parsed.data;
  } catch (e) {
    console.error("Google Sheet Error", e);
    return [];
  }
};

const SUBJECT_TOTALS = {
  PCB: {
    Physics: 40,
    Chemistry: 40,
    Biology: 80,
  },

  PCM: {
    Physics: 40,
    Chemistry: 40,
    Maths: 40,
  },

  Weekly: {
    Physics: 180,
    Chemistry: 180,
    Biology: 360,
  },

  Theory: {
    Physics: 25,
    Chemistry: 25,
    Maths: 25,
    Biology: 25,
  },
};

const SUBJECT_QUESTIONS = {
  PCB: {
    Physics: 10,
    Chemistry: 10,
    Biology: 20,
  },

  PCM: {
    Physics: 10,
    Chemistry: 10,
    Maths: 10,
  },

  Weekly: {
    Physics: 45,
    Chemistry: 45,
    Biology: 90,
  },

  Theory: {
    Physics: 25,
    Chemistry: 25,
    Maths: 25,
    Biology: 25,
  },
};

const formatDate = (date) => {
  if (!date) return "";

  const text = String(date).trim();

  // Already yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  // dd/mm/yyyy
  if (text.includes("/")) {
    const [d, m, y] = text.split("/");

    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // dd-mm-yyyy
  if (text.includes("-")) {
    const [d, m, y] = text.split("-");

    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return text;
};

const calculatePercentage = (
  obtained,
  total
) => {

  if (
    obtained === "AB" ||
    total === "AB"
  )
    return "AB";

  if (!total)
    return 0;

  return Number(
    ((obtained / total) * 100).toFixed(2)
  );

};

export const getSettings = async () => {

  const rows = await fetchSheet(SHEET_IDS.settings);

  const settings = {};

  rows.forEach((row) => {
    settings[row.Key?.trim()] = row.Value;
  });

  return settings;
};

const getStudentResults = async (
  sheetId,
  studentIdentifier  // Can be either roll number or student name
) => {

  const rows = await fetchSheet(sheetId);

  // Try to find by roll number first (more reliable)
  let filteredRows = rows.filter(
    row => row["Roll Number"]?.trim() === studentIdentifier.trim()
  );

  // If not found by roll number, try by student name (fallback)
  if (filteredRows.length === 0) {
    filteredRows = rows.filter(
      row => row["Student Name"]?.trim() === studentIdentifier.trim()
    );
  }

  // If still not found, log it
  if (filteredRows.length === 0) {
    console.warn(
      `[getStudentResults] No results found for: ${studentIdentifier}`,
      `Searched in sheet ${sheetId} by Roll Number and Student Name`
    );
  }

  return filteredRows.sort(
    (a, b) =>
      new Date(a["Date"]) -
      new Date(b["Date"])
  );

};

const getValue = (value) => {

  if (value === undefined || value === null)
    return 0;

  const text = String(value).trim();

  if (
    text === "" ||
    text.toUpperCase() === "AB"
  ) {
    return "AB";
  }

  const number = Number(text);

  return isNaN(number) ? 0 : number;

};

const formatResultData = (rows, testType) => {

  const results = {};

  rows.forEach((row) => {

    const calendarDate = formatDate(row["Date"]);

    const isAbsent =
      (row["Status"] || "").trim().toUpperCase() === "ABSENT";

    let obtainedMarks = 0;
    if (testType === "PCB") {
        obtainedMarks =
            getValue(row["Physics Marks"]) +
            getValue(row["Chemistry Marks"]) +
            getValue(row["Biology Marks"]);
        }

        if (testType === "PCM") {
        obtainedMarks =
            getValue(row["Physics Marks"]) +
            getValue(row["Chemistry Marks"]) +
            getValue(row["Maths Marks"]);
        }
        
        if (testType === "Weekly") {
        obtainedMarks =
            getValue(row["Physics Marks"]) +
            getValue(row["Chemistry Marks"]) +
            getValue(row["Biology Marks"]);
        }

        if (testType === "Theory") {
        obtainedMarks =
            getValue(row["Physics Marks"]) +
            getValue(row["Chemistry Marks"]) +
            getValue(row["Maths Marks"]) +
            getValue(row["Biology Marks"]);
        }
    const result = {
      testNo: row["Test No"],
      date: row["Date"],
        calendarDate: formatDate(row["Date"]),
      day: new Date(
            formatDate(row["Date"])
        ).toLocaleDateString("en-US", {
            weekday: "long",
        }),

      studentName: row["Student Name"],

      testType,

      status: row["Status"] || "Present",

      totalMarks:
        testType === "PCB"
            ? 160
            : testType === "PCM"
            ? 120
            : testType === "Weekly"
            ? 720
            : 100,

      obtainedMarks: isAbsent
        ? "AB"
        : obtainedMarks,

      percentage: isAbsent
        ? "AB"
        : Number(row["Percentage"]) || 0,

      subjects: {},
    };

    const totals = SUBJECT_TOTALS[testType];

    Object.keys(totals).forEach((subject) => {

      const marks = getValue(
        row[`${subject} Marks`]
      );

      const subjectData = {
        marks,
        totalMarks: totals[subject],
        questions: SUBJECT_QUESTIONS[testType][subject],
        };

        if (testType !== "Theory") {
        subjectData.correct = getValue(row[`${subject} Correct`]);
        subjectData.wrong = getValue(row[`${subject} Wrong`]);
        subjectData.skip = getValue(row[`${subject} Skipped`]);
        }

      result.subjects[subject] = subjectData;

    });

    results[calendarDate] = result;

  });

  return results;

};

export const getPCBResults = async (studentIdentifier) => {
  const rows = await getStudentResults(
    SHEET_IDS.pcb,
    studentIdentifier
  );
  return formatResultData(rows, "PCB");
};

export { fetchSheet, SHEET_IDS, SUBJECT_TOTALS, formatDate, calculatePercentage };

export const getPCMResults = async (studentIdentifier) => {
  const rows = await getStudentResults(
    SHEET_IDS.pcm,
    studentIdentifier
  );
  return formatResultData(rows, "PCM");
};

export const getWeeklyResults = async (studentIdentifier) => {
  const rows = await getStudentResults(
    SHEET_IDS.weekly,
    studentIdentifier
  );
  return formatResultData(rows, "Weekly");
};

export const getTheoryResults = async (studentIdentifier) => {
  const rows = await getStudentResults(
    SHEET_IDS.theory,
    studentIdentifier
  );
  return formatResultData(rows, "Theory");
};

export const getTodayTest = async () => {

  const settings = await getSettings();

  const [year, month, day] = calendarDate.split("-");

    const jsDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
    );

    result.day = jsDate.toLocaleDateString("en-US", {
    weekday: "long",
    });

  return {
    day,
    test: settings[`${day} Test`] || "Holiday",
    marks: settings[`${day} Marks`] || "",
    subjects: settings[`${day} Subjects`] || "",
  };

};

export const getLatestResultDates = async () => {
  const settings = await getSettings();

  return {
    pcb: settings["Latest Published PCB"],
    pcm: settings["Latest Published PCM"],
    weekly: settings["Latest Published Weekly"],
    theory: settings["Latest Published Theory"],
  };
};


export const getAnnouncement = async () => {
  const settings = await getSettings();
  return settings["Announcement"] || "";
};

const normalizeStatus = (raw) => {
  const text = (raw || "").trim().toLowerCase();
  if (text === "completed") return "Completed";
  if (text === "in progress" || text === "in-progress") return "In Progress";
  return "Not Started";
};

export const getSyllabus = async () => {

  const [rows11, rows12] = await Promise.all([
    fetchSheet(SHEET_IDS.syllabus11),
    fetchSheet(SHEET_IDS.syllabus12),
  ]);

  const parseRows = (rows) =>
    rows
      .map((row, idx) => {
        const subject = row["Subject"]?.trim();
        const chapter = row["Chapter"]?.trim();
        if (!subject || !chapter) return null;

        return {
          subject,
          group: row["Group"]?.trim() || "",
          chapter,
          status: normalizeStatus(row["Status"]),
          order: idx,
        };
      })
      .filter(Boolean);

  return [
    ...parseRows(rows11),
    ...parseRows(rows12),
  ];
};

export const getLatestResultDate = async (
  testType,
  studentName
) => {

  let data = {};

  switch (testType) {

    case "PCB":
      data = await getPCBResults(studentName);
      break;

    case "PCM":
      data = await getPCMResults(studentName);
      break;

    case "Weekly":
      data = await getWeeklyResults(studentName);
      break;

    case "Theory":
      data = await getTheoryResults(studentName);
      break;

    default:
      return null;

  }

  const dates = Object.keys(data).sort().reverse();

  return dates.length ? dates[0] : null;

};
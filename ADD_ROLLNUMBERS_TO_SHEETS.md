# How to Add Roll Numbers to Google Sheets 📋

## What Changed in the App
The app now searches for student results by **Roll Number** instead of Student Name. This is more reliable because:
- ✅ Roll numbers are unique per student
- ✅ Student names might have spelling variations
- ✅ Multiple students might have the same name

---

## Step 1: Add "Roll Number" Column to Each Sheet

You need to add a **"Roll Number"** column to the first row (header) of each test results sheet.

### Sheets to Update:
1. **PCB** (sheet with PCB test results)
2. **PCM** (sheet with PCM test results)
3. **Weekly** (sheet with weekly test results)
4. **Theory** (sheet with theory test results)

---

## Step 2: For Each Sheet

### Example: PCB Sheet

**Current structure (before):**
```
| Test No | Date       | Student Name | Physics Marks | Chemistry Marks | Biology Marks | ... |
| 1       | 14-07-2026 | Prathush     | 30            | 25              | 60            | ... |
| 2       | 15-07-2026 | Arjun        | 28            | 22              | 55            | ... |
```

**New structure (after):**
```
| Test No | Date       | Roll Number  | Student Name | Physics Marks | Chemistry Marks | Biology Marks | ... |
| 1       | 14-07-2026 | OJA-2025-001 | Prathush     | 30            | 25              | 60            | ... |
| 2       | 15-07-2026 | OJA-2025-002 | Arjun        | 28            | 22              | 55            | ... |
```

### How to Add the Column:

1. **Open Google Sheet** (e.g., PCB results tab)
2. **Right-click on column A** (or any column where you want Roll Number)
3. **Select "Insert 1 left"** to add a new column
4. **In the first cell of new column, type:** `Roll Number`
5. **Fill in roll numbers for each student**
   - Format: `OJA-2025-001`, `OJA-2025-002`, etc.
   - Or use your actual roll number format

### Example for PCB Sheet:

**Before:**
```
A: Test No
B: Date
C: Student Name
D: Physics Marks
```

**After:**
```
A: Test No
B: Date
C: Roll Number  ← NEW COLUMN
D: Student Name
E: Physics Marks
```

---

## Step 3: Repeat for All 4 Sheets

Do the same for:
- PCB sheet
- PCM sheet
- Weekly sheet
- Theory sheet

---

## Step 4: Ensure Roll Numbers Match

The roll numbers in your Google Sheets **MUST MATCH** the roll numbers in the database registration.

### Check Your Roll Numbers:

1. Open Django admin: `http://localhost:8000/admin/`
2. Go to **Student Profiles**
3. Copy each student's **Roll Number**

### Example:
```
Student: Prathush  → Roll Number: OJA-2025-001
Student: Arjun     → Roll Number: OJA-2025-002
Student: John      → Roll Number: OJA-2025-003
```

**Make sure these EXACT values appear in the Google Sheets!**

---

## Step 5: Test the App

After updating the sheets:

1. **Refresh the app** (Ctrl+Shift+R)
2. **Login with your credentials**
3. **Click "My Results"**
4. **Select "Weekly Results" or any test type**
5. Should now **show your results** instead of "Loading Results..."

---

## Troubleshooting

### Still Showing "Loading Results..."?

**Check:**
1. ✓ Roll number column exists in all sheets with header `Roll Number` (exact spelling, case-sensitive)
2. ✓ Your roll number in sheet matches your roll number in database
3. ✓ You have at least one test result record for your roll number
4. ✓ Refresh app (Ctrl+Shift+R or clear browser cache)

### Check Browser Console for Logs:

Open Developer Tools (F12) → Console tab and look for:

**✓ Working:**
```
[ODTResultsScreen] Loading PCB results for roll number: OJA-2025-001
[ODTResultsScreen] Results loaded: 5 entries
```

**✗ Not working:**
```
[getStudentResults] No results found for: OJA-2025-001
Searched in sheet 1890134223 by Roll Number and Student Name
```

If you see "No results found", it means:
- Roll number doesn't exist in the sheet
- OR Roll number column header is wrong
- OR Sheet data is empty

---

## Quick Reference: Column Headers Required

Make sure these exact headers exist in each sheet:

**Required for all sheets:**
- `Roll Number` ← NEW (add this)
- `Date`
- `Student Name`
- `Status` (optional, shows Present/Absent)

**For PCB & PCM sheets:**
- `Physics Marks`
- `Chemistry Marks`
- `Biology Marks` (PCB only)
- `Maths Marks` (PCM only)
- `Physics Correct`, `Physics Wrong`, `Physics Skipped`
- `Chemistry Correct`, `Chemistry Wrong`, `Chemistry Skipped`
- etc.

**For Weekly sheet:**
- Same as PCB + `Biology` subjects

**For Theory sheet:**
- `Physics Marks`, `Chemistry Marks`, `Biology Marks`, `Maths Marks`

---

## Example: PCB Sheet Structure

```
Column A: Test No
Column B: Date
Column C: Roll Number          ← ADD THIS
Column D: Student Name
Column E: Status
Column F: Percentage
Column G: Physics Marks
Column H: Physics Correct
Column I: Physics Wrong
Column J: Physics Skipped
Column K: Chemistry Marks
Column L: Chemistry Correct
... etc
```

---

## After Adding Roll Numbers

**Bonus:** The app will now:
- ✅ Search by roll number (more reliable)
- ✅ Fall back to student name if roll number not found
- ✅ Show proper error if data not found
- ✅ Display YOUR results only (not hardcoded "Prathush")
- ✅ Work for all students automatically


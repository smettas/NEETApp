# Registration Form - Submit Issue Debugging Guide

## ❌ Issue: Step 3 Submit Button Not Working

### Root Causes Identified:

1. **Hardcoded Backend IP Address** ⚠️ **CRITICAL**
   - Current: `http://192.168.1.100:8000`
   - Your backend may be running on a different IP or localhost
   - Check what IP your computer is actually using

2. **Missing Terms Checkbox Confirmation**
   - The Submit button is DISABLED if you haven't checked the "I confirm..." checkbox
   - You MUST click the checkbox before submit is enabled

3. **Backend Not Running**
   - Ensure Django server is running: `python manage.py runserver`

### ✅ Fix Instructions:

#### Step 1: Find Your Correct Backend URL
Run this in terminal to find your computer's IP:
```
ipconfig
```
Look for "IPv4 Address" under your network adapter (e.g., `192.168.x.x`)

#### Step 2: Update API Backend URL
Edit `NEETApp/services/api.js` and change:
```javascript
const BASE_URL = "http://YOUR_IP_HERE:8000/api/auth";
```
Example:
```javascript
const BASE_URL = "http://192.168.1.5:8000/api/auth";  // Replace with YOUR IP
```

#### Step 3: Start Backend Server
```bash
cd e:\Projects\neet_backend
python manage.py runserver 0.0.0.0:8000
```
This makes it accessible from other devices on your network.

#### Step 4: Verify Frontend Connection
- Check browser/app console for logs (look for `[API]` debug messages)
- You should see: `[API] POST http://YOUR_IP:8000/api/auth/register/`

### 🧪 Testing Checklist:

- [ ] Backend is running on port 8000
- [ ] Backend URL in api.js is updated with your correct IP
- [ ] Mobile number is not already registered
- [ ] Roll number is not already registered
- [ ] Password is 6-15 characters
- [ ] All required fields (marked with *) are filled
- [ ] **✓ Checkbox "I confirm..." is CHECKED**
- [ ] No typos in field values

### 📋 Required Fields for Registration:
- **Step 1:**
  - First Name *
  - Gender *
  - Roll Number *
  
- **Step 2:**
  - Mobile Number * (10 digits, starts with 6-9)
  - Currently Studying *
  - Password * (6-15 chars)
  - Confirm Password *

- **Step 3:**
  - Address (optional)
  - **✓ Confirmation Checkbox (required to submit)**

### 🔍 Debug Logs:
Look at the browser/app console for `[API]` and `[RegisterScreen]` logs to see:
- What data is being sent
- What errors the API returns
- Network connectivity issues

### 💡 Common Errors:

| Error | Fix |
|-------|-----|
| "Could not reach the server" | Check backend URL and ensure server is running |
| "Mobile number already registered" | Use a different mobile number |
| "Roll Number already registered" | Use a different roll number |
| "Passwords do not match" | Make sure password & confirm password are identical |
| Submit button disabled/greyed out | Check the "I confirm..." checkbox |
| "Invalid password" (on login) | Password is case-sensitive |

### 🚀 If Still Not Working:

1. **Clear app cache** and reload
2. **Restart backend server**: Stop and run `python manage.py runserver 0.0.0.0:8000` again
3. **Check network**: Phone/device must be on same WiFi as computer with backend
4. **Check browser console** for exact error messages
5. **Verify data format**: Ensure mobile number is exactly 10 digits, password meets requirements


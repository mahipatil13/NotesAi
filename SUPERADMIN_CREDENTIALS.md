# 🛡️ Smart Study AI — Superadmin Credentials & Access Guide

This document contains configuration details and authorized administrator accounts for the **Smart Study AI** platform.

---

## 🔑 Authorized Superadmin Accounts

When any of the following Google or email accounts sign in (via **"Continue with Google"** or **Email/Password**), the platform automatically grants them **Superadmin Privileges**:

| Name | Authorized Email / Google Account | Role | Access Level |
|---|---|---|---|
| **Mahesh Patil** (Primary) | `mahipatil13@gmail.com` | `superadmin` | Full Moderator & Console Access |
| **Mahesh Patil** (Alt Google) | `maheshpatil13@gmail.com` | `superadmin` | Full Moderator & Console Access |
| **Mahesh Patil** (Alt Google) | `mahiiipatil13@gmail.com` | `superadmin` | Full Moderator & Console Access |
| **College Admin** | `mahesh@college.edu` | `superadmin` | Full Moderator & Console Access |

---

## 🚀 How to Access the Superadmin Console

1. Navigate to your website:
   - **Local:** [http://localhost:3000/login](http://localhost:3000/login)
   - **Live Production:** `https://your-app.vercel.app/login`
2. Click **"Continue with Google"** and select your authorized Google account (or enter your email above).
3. Once logged in:
   - You will see the **Admin Console** link in the navigation bar.
   - Or navigate directly to **`/admin`** ([http://localhost:3000/admin](http://localhost:3000/admin)).

---

## 🛠️ Superadmin Capabilities on `/admin`

As a Superadmin, you have full control over the platform:

- ✅ **Approve Contributed Notes:** Review student-submitted lecture notes, question banks, and generated exam packs before publishing to the public library.
- ❌ **Reject Submissions:** Reject irrelevant or non-syllabus documents with custom feedback.
- 🗑️ **Delete Notes & Documents:** Remove any document from the public library or database.
- 👥 **Inspect Study Groups:** View private study circles, invite codes, and shared materials.
- ⚡ **Real-time PostgreSQL Sync:** Changes made in the Admin console sync immediately to all connected students.

---

## ➕ How to Add More Superadmins in the Future

To authorize a new administrator or faculty member:
1. Open [`src/lib/store.ts`](file:///c:/Users/Mahesh%20patil/OneDrive/Desktop/notesai/src/lib/store.ts#L50).
2. Add the new email address to the `SUPERADMIN_EMAILS` array:
   ```typescript
   export const SUPERADMIN_EMAILS = [
     'mahipatil13@gmail.com',
     'maheshpatil13@gmail.com',
     'mahiiipatil13@gmail.com',
     'mahesh@college.edu',
     'new-admin@college.edu', // Add new email here
   ];
   ```
3. Commit and push to `main`.

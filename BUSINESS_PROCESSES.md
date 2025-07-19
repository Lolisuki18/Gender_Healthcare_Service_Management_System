# Business Processes of Gender Healthcare Service Management System

---

## 1. User Registration & Authentication Process

**Steps:**

1. User accesses the registration or login page.
2. User enters credentials (email/password) or chooses Google OAuth.
3. System validates credentials.
4. On success, system assigns a role and creates a session (JWT).
5. User is redirected to their dashboard based on role.

```mermaid
graph TD
  A[User accesses login/register page] --> B{Enter credentials or Google OAuth?}
  B -->|Email/Password| C[System validates credentials]
  B -->|Google OAuth| D[System validates via Google]
  C --> E{Valid?}
  D --> E
  E -->|Yes| F[Assign role & create session]
  F --> G[Redirect to dashboard]
  E -->|No| H[Show error message]
```

---

## 2. Profile Management Process

**Steps:**

1. User navigates to profile settings.
2. User updates personal information.
3. System validates and saves changes.
4. User receives confirmation.

```mermaid
graph TD
  A[User opens profile settings] --> B[Update info]
  B --> C[System validates]
  C --> D{Valid?}
  D -->|Yes| E[Save changes]
  E --> F[Show confirmation]
  D -->|No| G[Show error]
```

---

## 3. Consultation Booking & Management Process

**Steps:**

1. Customer browses consultants and selects one.
2. Customer chooses date/time and books.
3. System checks availability and confirms.
4. Notifications sent to both parties.
5. Consultant can accept/reschedule.
6. After consultation, feedback is provided.

```mermaid
graph TD
  A[Customer browses consultants] --> B[Select consultant & time]
  B --> C[System checks availability]
  C --> D{Available?}
  D -->|Yes| E[Confirm booking]
  E --> F[Send notifications]
  F --> G[Consultant accepts/reschedules]
  G --> H[Consultation occurs]
  H --> I[Feedback]
  D -->|No| J[Show alternative slots]
```

---

## 4. Medical Test Registration & Result Management Process

**Steps:**

1. Customer selects test package/service.
2. Registers for test.
3. System schedules and notifies staff.
4. Staff collects samples and updates status.
5. Staff uploads results.
6. Customer/consultant view/download results.

```mermaid
graph TD
  A[Customer selects test package] --> B[Register for test]
  B --> C[System schedules & notifies staff]
  C --> D[Staff collects samples]
  D --> E[Update test status]
  E --> F[Upload results]
  F --> G[Customer/Consultant view/download]
```

---

## 5. Blog & Content Management Process

**Steps:**

1. Staff/admin creates and submits blog post.
2. Admin reviews and approves/rejects.
3. Approved posts are published.
4. Users can read blogs.

```mermaid
graph TD
  A[Staff/Admin creates blog] --> B[Submit for review]
  B --> C[Admin reviews]
  C --> D{Approve?}
  D -->|Yes| E[Publish blog]
  D -->|No| F[Reject/Request changes]
  E --> G[Users read blog]
```

---

## 6. Q&A and Support Process

**Steps:**

1. Customer submits question.
2. System notifies consultants.
3. Consultant answers.
4. Customer receives response.

```mermaid
graph TD
  A[Customer submits question] --> B[System notifies consultants]
  B --> C[Consultant answers]
  C --> D[Customer receives response]
```

---

## 7. Payment & Invoice Processing

**Steps:**

1. Customer selects service/test and proceeds to payment.
2. Chooses payment method.
3. System processes payment and updates history.
4. Invoice generated (PDF).
5. Customer receives confirmation.

```mermaid
graph TD
  A[Customer selects service/test] --> B[Proceed to payment]
  B --> C[Choose payment method]
  C --> D[System processes payment]
  D --> E[Update payment history]
  E --> F[Generate invoice (PDF)]
  F --> G[Send confirmation]
```

---

## 8. Review & Feedback Collection Process

**Steps:**

1. Customer is prompted to leave a review.
2. Submits rating and feedback.
3. System stores and displays reviews.
4. Staff/consultants view feedback.

```mermaid
graph TD
  A[Prompt for review] --> B[Customer submits feedback]
  B --> C[System stores review]
  C --> D[Display reviews]
  D --> E[Staff/Consultant view feedback]
```

---

## 9. Notification & Reminder System Process

**Steps:**

1. System schedules notifications (appointments, results, reminders).
2. Sends notifications to users.
3. Users receive and act on notifications.

```mermaid
graph TD
  A[System schedules notification] --> B[Send notification]
  B --> C[User receives notification]
  C --> D[User acts on notification]
```

---

## 10. Menstrual Cycle Tracking Process

**Steps:**

1. Customer logs cycle data.
2. System analyzes and predicts next cycle/ovulation.
3. Sends reminders and tips.

```mermaid
graph TD
  A[Customer logs cycle data] --> B[System analyzes data]
  B --> C[Predict next cycle/ovulation]
  C --> D[Send reminders/tips]
```

---

## 11. Admin & Staff Operations Process

**Steps:**

1. Admin/Staff log in to dashboard.
2. Manage users, services, content, payments.
3. Review/approve content.
4. Generate reports and export data.

```mermaid
graph TD
  A[Admin/Staff login] --> B[Manage users/services/content]
  B --> C[Review/approve content]
  C --> D[Generate reports]
  D --> E[Export data]
```

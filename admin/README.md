# Spartans Cricket Club - Admin Panel

## 🚀 Quick Start

### Access the Admin Panel

1. **Open the Login Page**:
   - Navigate to: `/Users/boneymathew/spartans-cricket-club/admin/login.html`
   - Double-click to open in your browser

2. **Login Credentials**:
   - Username: `admin`
   - Password: `admin123`

3. **Start Managing**:
   - Add/Edit/Delete Players
   - Add/Edit/Delete Match Fixtures
   - All changes reflect instantly on the main website!

---

## 📍 Important Files

### Admin Panel
- **Login**: `/admin/login.html`
- **Dashboard**: `/admin/dashboard.html`

### Backend API
- Running on: `http://localhost:8080`
- Endpoints:
  - Players: `GET/POST/PUT/DELETE /api/players`
  - Matches: `GET/POST/PUT/DELETE /api/matches`
  - Auth: `POST /api/auth/login`

### Main Website
- Running on: `http://localhost:5173`
- Frontend displays data from the backend in real-time

---

## ✨ Features

### Player Management
- Add new players with stats (runs, wickets, matches played)
- Edit existing player information
- Delete players
- Upload player images (via URL)

### Match Management
- Schedule upcoming matches
- Update match status (Upcoming/Live/Completed)
- Record match results
- Manage venue and opponent information

### Real-Time sync
- Any changes made in the admin panel are instantly reflected on the main website
- Both the main site and admin use the same backend API

---

## 🗄️ Database

### Current Setup (For Testing)
- **H2 In-Memory Database**: Data resets when the backend restarts
- Perfect for development and testing
- Pre-loaded with sample players and matches

### Future Migration (Production Ready)
To switch to a persistent database like MySQL or PostgreSQL:

1. **Update `backend/src/main/resources/application.properties`**:

```properties
# For MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/spartans_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

2. **Add MySQL/PostgreSQL dependency to `backend/pom.xml`**:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

3. **Restart the backend** and your data will persist!

---

## 🔧 Running the System

### Start Backend (Terminal 1)
```bash
cd /Users/boneymathew/spartans-cricket-club/backend
mvn spring-boot:run
```

### Start Frontend (Terminal 2)
```bash
cd /Users/boneymathew/spartans-cricket-club/frontend
npm run dev
```

### Access Admin Panel
- Open `admin/login.html` in your browser
- No server needed - runs directly as HTML

---

## 🎨 Architecture

```
Main Website (localhost:5173)
       ↓ Fetches data from
Backend API (localhost:8080) ← H2 Database (In-Memory)
       ↑ Updates data via
Admin Panel (admin/*.html)
```

---

## 🔐 Security Notes

**⚠️ IMPORTANT**: The current authentication is basic and suitable for MVP/testing only.

For production, you should implement:
- JWT tokens with expiration
- Password hashing (BCrypt)
- Role-based access control
- HTTPS/SSL encryption

---

## 📝 Need Help?

- Backend not starting? Kill process on port 8080: `lsof -ti :8080 | xargs kill -9`
- CORS errors? The backend already allows file:// protocol for admin panel
- Want to add more features? The code is well-structured and easy to extend!

---

## 🎯 Next Steps

1. Test the admin panel by adding/editing/deleting players and matches
2. Verify changes appear on the main website
3. Plan your database migration strategy
4. Consider adding more admin features (news management, media uploads, etc.)

**Enjoy managing your cricket club! 🏏**

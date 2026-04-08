# Event Booking System

A full-stack web application for managing event venues, seats, and bookings with role-based access control, JWT authentication, and an intuitive user interface.

## Demo

### Homepage
![Homepage](https://img.shields.io/badge/Demo-Homepage-blue)

> The homepage provides quick access to browse events, venues, and manage bookings.

### Admin Dashboard
![Admin Dashboard](https://img.shields.io/badge/Demo-Admin-orange)

> Admin users can manage venues, events, seats, and view all bookings from a centralized dashboard.

### Event Booking Flow
![Booking Flow](https://img.shields.io/badge/Demo-Booking-green)

> Users can browse events, select available seats, and complete bookings with real-time seat availability.

## Product Context

### End Users

- **Regular Users**: People who want to discover events and book seats for concerts, conferences, comedy shows, and more.
- **Administrators**: Event organizers who manage venues, create events, configure seating arrangements, and monitor all bookings.

### Problem

Finding and booking seats for events is often fragmented across multiple platforms with inconsistent interfaces. Venue managers lack a centralized tool to manage their spaces, create events, and track bookings. Users struggle to see available seats and understand pricing before committing to a booking.

### Solution

A unified event booking platform that:
- Provides a clean, responsive interface for browsing and booking events
- Gives administrators full control over venues, events, and seat configurations
- Shows real-time seat availability with interactive seat selection
- Calculates total pricing automatically based on event price × seats selected
- Secures user data with JWT-based authentication and role-based access control

## Features

### Implemented ✅

- **Authentication & Authorization**
  - User registration with BCrypt password encryption
  - JWT-based login and session management
  - Role-based access control (ADMIN / USER)

- **User Features**
  - Browse all available events with search and filtering
  - Filter events by venue, date range (Today, This Week, This Month)
  - Search events by title or description
  - Interactive seat selection with real-time availability
  - View personal bookings with status tracking (CONFIRMED / CANCELLED)
  - Cancel bookings and release seats

- **Admin Features**
  - Dashboard with live statistics (venues, events, seats, active bookings)
  - Create, view, and delete venues
  - Create, view, and delete events with date/time and pricing
  - Bulk-create seats by row label and count
  - View all bookings across all users with status filtering

- **Technical Features**
  - Spring Boot 4.0.5 backend with Java 21
  - Spring Security with JWT token authentication
  - Spring Data JPA with MySQL 8.0
  - Global exception handling with descriptive error messages
  - Input validation on all API endpoints
  - Standalone frontend served directly from Spring Boot (no Node.js required)
  - Bootstrap 5 responsive UI

### Not Yet Implemented 🚧

- User profile management and password reset
- Event editing after creation
- Pagination for large data sets
- Email notifications for booking confirmations
- Payment processing integration
- Unit and integration tests
- Swagger/OpenAPI documentation
- Event categories and tags
- Seat map visualization (visual layout)
- Booking modification (change seats after booking)
- Multi-language support

## Usage

### Prerequisites

- Java 21 (OpenJDK or Oracle JDK)
- MySQL 8.0
- Maven (or use included Maven wrapper)

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/modar148/se-toolkit-hackathon.git
   cd se-toolkit-hackathon
   ```

2. **Configure database:**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/event_booking_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

3. **Create the database:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE event_booking_db;"
   ```

4. **Build and run:**
   ```bash
   # On Windows
   .\mvnw.cmd spring-boot:run

   # On Linux/Mac
   ./mvnw spring-boot:run
   ```

5. **Access the application:**
   Open your browser to `http://localhost:8080`

### Sample Accounts

The application auto-populates sample data on first run:

| Email | Password | Role |
|---|---|---|
| admin@eventbooking.com | password123 | ADMIN |
| john@example.com | password123 | USER |
| sarah@example.com | password123 | USER |
| user@example.com | password123 | USER |

### Using the Application

1. **Login** with any account above
2. **As Admin:**
   - Navigate to **Admin** → **Manage Venues** to create venues
   - Navigate to **Admin** → **Manage Events** to create events
   - Navigate to **Admin** → **Manage Seats** to add seats to venues
   - Navigate to **Admin** → **All Bookings** to view all user bookings
3. **As User:**
   - Browse **Events** to see upcoming events
   - Click **View Details** on an event to see available seats
   - Select seats and click **Book Selected Seats**
   - View your bookings under **My Bookings**

## Deployment

### Target Environment

- **OS**: Ubuntu 24.04 LTS (or compatible Linux distribution)
- **Architecture**: x86_64

### What Should Be Installed

1. **Java 21:**
   ```bash
   sudo apt update
   sudo apt install -y openjdk-21-jdk
   java -version
   ```

2. **MySQL 8.0:**
   ```bash
   sudo apt install -y mysql-server
   sudo systemctl start mysql
   sudo systemctl enable mysql
   mysql --version
   ```

3. **Optional: UFW (Firewall):**
   ```bash
   sudo apt install -y ufw
   ```

### Step-by-Step Deployment Instructions

#### 1. Transfer the Application to the VM

From your local machine, use SCP:
```bash
# First build the JAR locally
./mvnw.cmd clean package -DskipTests

# Then transfer the JAR
scp target/booking_system-0.0.1-SNAPSHOT.jar username@vm-ip:/home/username/
```

Or use WinSCP (Windows GUI tool) to drag-and-drop the JAR file.

#### 2. Setup the Database

SSH into your VM:
```bash
ssh username@vm-ip
```

Create the database and user:
```bash
sudo mysql -u root
```

Inside MySQL:
```sql
CREATE DATABASE IF NOT EXISTS event_booking_db;
CREATE USER 'bookinguser'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON event_booking_db.* TO 'bookinguser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Configure the Application

Create a production configuration file:
```bash
nano /home/username/application-prod.properties
```

Add:
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/event_booking_db
spring.datasource.username=bookinguser
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server
server.port=8080

# JWT
jwt.secret=YourSecretKeyForJWTTokenGenerationThatIsLongEnoughAndSecure
jwt.expiration=86400000
```

#### 4. Run the Application

```bash
cd /home/username
java -jar booking_system-0.0.1-SNAPSHOT.jar --spring.config.location=application-prod.properties
```

#### 5. Open Firewall Port (if applicable)

```bash
sudo ufw allow 8080/tcp
sudo ufw reload
```

#### 6. Access the Application

Open your browser to: `http://vm-ip:8080`

#### 7. (Optional) Run as a Systemd Service for Auto-Start

Create the service file:
```bash
sudo nano /etc/systemd/system/booking-system.service
```

Add:
```ini
[Unit]
Description=Event Booking System
After=syslog.target network.target mysql.service

[Service]
Type=simple
User=username
Group=username
WorkingDirectory=/home/username
ExecStart=/usr/bin/java -jar /home/username/booking_system-0.0.1-SNAPSHOT.jar --spring.config.location=/home/username/application-prod.properties
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable booking-system
sudo systemctl start booking-system
sudo systemctl status booking-system
```

View logs:
```bash
sudo journalctl -u booking-system -f
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4.0.5, Java 21 |
| Security | Spring Security, JWT (JJWT) |
| Database | MySQL 8.0, Spring Data JPA, Hibernate |
| Frontend | Vanilla JS, Bootstrap 5, Bootstrap Icons |
| Build | Maven (with Maven wrapper) |
| Deployment | Systemd (Linux service) |


Seat Reservation System

A user-friendly seat reservation system where users can select, reserve, and manage their train seats. This application features a streamlined booking process with error handling and automated seat limits. The frontend is deployed on Netlify, and the backend API is hosted on Railway. Live Site.

Features
Seat Selection & Reservation:

Users can select up to 7 seats per booking.
Automatic validation limits seat selection between 1 to 7 seats, ensuring user-friendly input management.
Real-Time Updates:

The interface dynamically updates seat availability status as seats are reserved or cancelled.
Error Handling:

Automatically restricts seat selection within the allowed range, eliminating error pop-ups.
Provides clear error feedback if network issues occur when fetching seat data or reserving seats.
Booking PDF Generation:

After a successful reservation, users receive a downloadable PDF with booking details, including PNR, date, source/destination stations, and a QR code for verification.
Seat Cancellation & Reset:

Cancel reserved seats by selecting them, and clear all reservations with the reset button to start fresh.
Tech Stack
Frontend: React, Bootstrap, CSS for a responsive and dynamic user experience.
Backend: Node.js with Express and Railway for API hosting and database integration.
Database: Seat data is stored and managed on the Railway-hosted backend.
PDF Generation: JSPDF for generating booking confirmation PDFs with QR code support.
Hosting:
Frontend: Netlify
Backend API: Railway
Installation & Usage
Prerequisites
Node.js
Environment variables:
REACT_APP_API_URL: Set to the URL of the backend API hosted on Railway.


Project Structure
Frontend (my-app/src/Components/SeatBooking.js): Contains the core UI and functionalities for seat selection, booking, and PDF generation.
Backend (server): Manages seat data, handles reservation requests, and serves API responses.

# Seat Reservation System

A user-friendly seat reservation system where users can select, reserve, and manage their train seats. This application features a streamlined booking process with error handling and automated seat limits. The frontend is deployed on Netlify, and the backend API is hosted on Railway.

## 🌐 Website:
[Live Site](https://reservationsys.netlify.app/)

---

## ✨ Features

### Seat Selection & Reservation
- **Flexible Selection**: Users can select up to 7 seats per booking.
- **Automatic Validation**: Seat selection is automatically restricted between 1 to 7 seats for a smooth user experience.

### Real-Time Updates
- **Availability Status**: The interface dynamically updates seat availability status as seats are reserved or canceled.

### Error Handling
- **Range Limits**: Automatically limits seat selection within the allowed range, avoiding unnecessary error pop-ups.
- **Network Error Handling**: Provides clear error feedback if network issues occur during seat data fetching or reservations.

### Booking PDF Generation
- **Downloadable Confirmation**: After successful reservation, users can download a PDF with booking details, including:
  - PNR
  - Date
  - Source and Destination Stations
  - QR Code for easy verification

### Seat Cancellation & Reset
- **Cancel Reservations**: Users can deselect reserved seats.
- **Reset Reservations**: Clear all selections and start fresh with the reset button.

---

**Note:** The code includes detailed comments to help you understand the logic and flow, making it easier to follow and modify as needed.


## 🛠 Tech Stack

- **Frontend**: React, Bootstrap, CSS for a responsive and dynamic user experience.
- **Backend**: Node.js with Express and Railway for API hosting and database integration.
- **Database**: Seat data is stored and managed on the Railway-hosted backend.
- **PDF Generation**: JSPDF for generating booking confirmation PDFs with QR code support.

### Hosting:
- **Frontend**: [Netlify](https://reservationsys.netlify.app/)
- **Backend API**: [Railway](https://unstophackathon-production.up.railway.app/)

---

## ⚙️ Installation & Usage

### Environment Variables
Create two `.env` files with the following variable names:

1. **Frontend (`my-app/.env`)**
   ```plaintext
   REACT_APP_API_URL
2. **Backend (`server/.env`)**
   ```plaintext
    DB_CONNECTION_STRING
    PORT
## Setup
### Clone this repository:
      git clone <repository-url>
      cd seat-reservation-system
    
### Install frontend dependencies:
        cd my-app
        npm install

### Start the frontend locally:

    npm start

### Build for production:

    npm run build

## 📁 Project Structure

- **Frontend** (`my-app/src/Components/SeatBooking.js`): Contains the core UI and functionalities for seat selection, booking, and PDF generation.
- **Backend** (`server`): Manages seat data, handles reservation requests, and serves API responses.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the issues page if you want to contribute.

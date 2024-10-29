import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import { jsPDF } from "jspdf";
import "../styles/seatBooking.css";

const SeatBooking = () => {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(1);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch seats data from the server
    axios
      .get("http://localhost:5000/seats")
      .then((res) => setSeats(res.data))
      .catch((err) => console.error("Error fetching seats:", err));
  }, [reservedSeats]);

  const generatePDF = (seatsList) => {
    const doc = new jsPDF();

    // Hardcoded Train ID, Passenger Name, and Date
    const trainID = "12345A";
    const passengerName = "John Doe";
    const pnr = Math.floor(1000000000 + Math.random() * 9000000000); // Random PNR
    const date = "2024-10-15"; // Hardcoded date

    // Predefined station list
    const stations = [
      "New Delhi",
      "Mumbai Central",
      "Kolkata Howrah",
      "Chennai Central",
      "Bengaluru City",
      "Ahmedabad Junction",
      "Hyderabad Deccan",
      "Jaipur Junction",
      "Lucknow Junction",
      "Pune Junction",
    ];

    // Randomly choose a source and destination station
    const sourceStation = stations[Math.floor(Math.random() * stations.length)];
    const destinationStation =
      stations[Math.floor(Math.random() * stations.length)];

    // QR Code
    const qrCodeData = `PNR: ${pnr} | Train: ${trainID} | Date: ${date} | Seats: ${seatsList.join(
      ", "
    )}`;

    // Set font and style
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Train Ticket Confirmation", 70, 20);

    // Add some details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Train ID: ${trainID}`, 10, 40);
    doc.text(`PNR: ${pnr}`, 150, 40);

    doc.text(`Passenger Name: ${passengerName}`, 10, 50);
    doc.text(`Date: ${date}`, 150, 50);

    // Random station names
    doc.text(`From: ${sourceStation}`, 10, 60);
    doc.text(`To: ${destinationStation}`, 150, 60);

    // Line separator
    doc.line(10, 70, 200, 70);

    // Seat information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Reserved Seat Details", 10, 80);

    // List of reserved seats
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Seats: ${seatsList.join(", ")}`, 10, 90);

    // QR Code generation
    const qrSize = 50; // QR code size
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(
      qrCodeData
    )}`;

    const img = new Image();
    img.src = qrCodeUrl;
    img.onload = () => {
      doc.addImage(img, "PNG", 150, 100, qrSize, qrSize); // Adding QR Code image to the PDF

      // Footer message
      doc.setFontSize(10);
      doc.text(
        "Thank you for booking with us! Have a pleasant journey.",
        10,
        160
      );

      // Save the PDF with a meaningful filename
      doc.save(`booking-confirmation-${pnr}.pdf`);
    };
  };

  const reserveSeats = () => {
    axios
      .post("http://localhost:5000/reserve", { numberOfSeats: numSeats })
      .then((res) => {
        setMessage(`Seats reserved: ${res.data.seats.join(", ")}`);
        setReservedSeats(res.data.seats);
        generatePDF(res.data.seats);
        setTimeout(() => {
          setMessage("");
        }, 5000);
      })
      .catch((err) => setMessage(err.response.data.error));
  };

  const cancelReservation = () => {
    axios
      .post("http://localhost:5000/cancel", { seatNumbers: selectedSeats })
      .then((res) => {
        setMessage(res.data.message);
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            selectedSeats.includes(seat.seat_number)
              ? { ...seat, is_booked: false }
              : seat
          )
        );
        setSelectedSeats([]);
      })
      .catch((err) => console.error("Error cancelling reservation:", err));
  };

  const resetReservation = () => {
    axios
      .get("http://localhost:5000/reset-seats")
      .then((response) => {
        setMessage(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        setMessage("Failed to reset seats. Try again.");
      });
  };

  const handleSelectSeat = (seatNumber) => {
    const seat = seats.find((s) => s.seat_number === seatNumber);

    if (seat.is_booked) {
      setSelectedSeats((prev) => {
        if (prev.includes(seatNumber)) {
          return prev.filter((s) => s !== seatNumber);
        } else {
          return [...prev, seatNumber];
        }
      });
    } else {
      setMessage("This seat is not booked, so it can't be cancelled.");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4 title">Train Seat Booking</h1>

      {message && <Alert variant="info">{message}</Alert>}

      <Form className="mb-4">
        <Form.Group as={Row} controlId="formNumSeats">
          <Form.Label column sm="4">
            <p className="mx-5">Number of seats to reserve:</p>
          </Form.Label>
          <Col sm="4">
            <Form.Control
              type="number"
              value={numSeats}
              onChange={(e) => setNumSeats(e.target.value)}
              min="1"
              max="7"
            />
          </Col>
        </Form.Group>
      </Form>

      <div className="text-center mb-4">
        <Button variant="primary" onClick={reserveSeats} className="mx-2">
          Reserve Seats
        </Button>
        <Button
          variant="danger"
          onClick={cancelReservation}
          disabled={selectedSeats.length === 0}
          className="mx-2"
        >
          Cancel Selected Seats
        </Button>
        <Button variant="warning" onClick={resetReservation} className="mx-2">
          Reset All Seats
        </Button>
      </div>

      <h2 className="text-center my-4">Seats Layout</h2>
      <div className="d-flex justify-content-center mb-4">
        <div className="seat-grid">
          {seats.map((seat) => (
            <div
              key={seat.seat_number}
              className={`seat ${seat.is_booked ? "booked" : ""} ${
                selectedSeats.includes(seat.seat_number) ? "selected" : ""
              }`}
              onClick={() =>
                seat.is_booked && handleSelectSeat(seat.seat_number)
              }
              style={{ cursor: seat.is_booked ? "pointer" : "not-allowed" }}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default SeatBooking;

import express from "express";
import fs from "fs";

const app = express();
const rooms = [];
const bookings = [];

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello");
});
app.post("/newrooms", (req, res) => {
  const { room_no, amenities, seats, price } = req.body;
  const exisitingroom = rooms.find((room) => room.room_no === room_no);
  if (exisitingroom) {
    return res
      .status(400)
      .json({ error: "Room with the same name already exists" });
  }
  const room = {
    id: rooms.length + 1,
    room_no,
    amenities,
    seats,
    price,
  };

  rooms.push(room);
  console.log("Room Created");
  res.send("Room Created");

  console.log(rooms);
});

app.post("/newbookings", (req, res) => {
  const currentDate = new Date();
  const bdate = currentDate.toISOString().split("T")[0];
  const { room_no, customer_name, date, start_time, end_time, booking_date } =
    req.body;
  const exisitingroom = rooms.find((room) => room.room_no === room_no);
  const existingbooking = bookings.find((room) => room.room_no === room_no);
  if (!exisitingroom) {
    return res.status(400).json({ error: "Room is not available" });
  }
  if (existingbooking) {
    return res.status(400).json({ error: "Room is already booked" });
  }
  const booking = {
    booking_no: bookings.length + 1,
    room_no,
    customer_name,
    date,
    start_time,
    end_time,
    booking_date: bdate,
  };

  bookings.push(booking);
  console.log("Room Booked");
  res.send("Room Booked");

  console.log(bookings);
});
app.get("/rooms", (req, res) => {
  const bookedRooms = rooms.map((room) => {
    const booking = bookings.find((b) => b.room_no === room.room_no);
    return {
      room_no: room.room_no,
      booked_status: booking ? "Filled" : "Empty",
      booking_no: booking ? booking.booking_no : "",
      customer_name: booking ? booking.customer_name : "",
      date: booking ? booking.date : "",
      start_time: booking ? booking.start_time : "",
      end_time: booking ? booking.end_time : "",
    };
  });

  const tableRows = bookedRooms.map(
    (room) => `<tr>
        <td>${room.room_no}</td>
        <td>${room.booked_status}</td>
        <td>${room.booking_no}</td>
        <td>${room.customer_name}</td>
        <td>${room.date}</td>
        <td>${room.start_time}</td>
        <td>${room.end_time}</td>
      </tr>`
  );

  const tableHtml = `
      <div>
        <table border="1">
          <thead>
            <tr>
              <th>Room No</th>
              <th>Booked Status</th>
              <th>Booking No</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
      </div>
    `;

  res.send(tableHtml);
});
app.get("/customers", (req, res) => {
  const bookedRooms = rooms.map((room) => {
    const booking = bookings.find((b) => b.room_no === room.room_no);
    return {
      room_no: room.room_no,
      customer_name: booking ? booking.customer_name : "",
      date: booking ? booking.date : "",
      start_time: booking ? booking.start_time : "",
      end_time: booking ? booking.end_time : "",
    };
  });

  const tableRows = bookedRooms.map(
    (room) => `<tr>
        <td>${room.room_no}</td>
        <td>${room.customer_name}</td>
        <td>${room.date}</td>
        <td>${room.start_time}</td>
        <td>${room.end_time}</td>
      </tr>`
  );

  const tableHtml = `
      <div>
        <table border="1">
          <thead>
            <tr>
              <th>Room No</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
      </div>
    `;

  res.send(tableHtml);
});

app.get("/total", (req, res) => {
  const bookedRooms = rooms.map((room) => {
    const booking = bookings.find((b) => b.room_no === room.room_no);

    return {
      customer_name: booking ? booking.customer_name : "",
      room_no: room.room_no,
      date: booking ? booking.date : "",
      start_time: booking ? booking.start_time : "",
      end_time: booking ? booking.end_time : "",
      booking_no: booking ? booking.booking_no : "",
      booking_date: booking ? booking.booking_date : "",
      booked_status: booking ? "Filled" : "Empty",
    };
  });

  const tableRows = bookedRooms.map(
    (room) => `<tr>
    <td>${room.customer_name}</td>
          <td>${room.room_no}</td>
          <td>${room.date}</td>
          <td>${room.start_time}</td>
          <td>${room.end_time}</td>
          <td>${room.booking_no}</td>
          <td>${room.booking_date}</td>
          <td>${room.booked_status}</td>
  

        </tr>`
  );

  const tableHtml = `
        <div>
          <table border="1">
            <thead>
              <tr>
              <th>Customer Name</th>
                <th>Room No</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Booking No</th>
                <th>Booking Date</th>
                <th>Booked Status</th>

                
              </tr>
            </thead>
            <tbody>
              ${tableRows.join("")}
            </tbody>
          </table>
        </div>
      `;

  res.send(tableHtml);
});

app.listen(3000, () => {
  console.log("Port started on 3000");
});
console.log(rooms);

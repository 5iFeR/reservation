import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import "./styles.css";

// Queries
const GET_RESERVATION = gql`
  query Reservation($id: ID!) {
    reservation(id: $id) {
      id
      name
      lname
      phone
      adults
      kids
      date
      startTime
      endTime
      tables
      archived
    }
  }
`;

const GET_RESERVATIONS = gql`
  query Reservations {
    reservations {
      id
    }
  }
`;

// Mutations
const ADD_RESERVATION = gql`
  mutation AddReservation($reservation: ReservationInput!) {
    addReservation(reservation: $reservation) {
      id
      name
      lname
      phone
      adults
      kids
      date
      startTime
      endTime
      tables
      archived
    }
  }
`;

const ERROR_MESSAGES = {
  name: "Name is required and should be at least 3 characters long",
  lname: "Last name is required and should be at least 3 characters long",
  phone: "Phone number is required and should be 10 digits long",
  adults: "Number of adults is required and should be at least 1",
  kids: "Number of kids should be a positive number or 0",
  date: "Date is required and should be in the format YYYY-MM-DD",
  startTime: "Start time is required and should be a number between 0 and 23",
  endTime: "End time is required and should be a number between 0 and 23",
  reservationDurationShort: "Reservation duration must be at least 30 minutes",
  reservationDurationLong: "Reservation duration can't be longer than 4 hours",
  tables: "Number of tables is required and should be at least 1",
  table: "Table is already reserved at this time",
};

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function validateReservation(reservation, reservations) {
  const { name, lname, phone, adults, kids, date, startTime, endTime, tables } =
    reservation;
  const errors = {};
  if (!name || name.length < 3) {
    errors.name = ERROR_MESSAGES.name;
  }
  if (!lname || lname.length < 3) {
    errors.lname = ERROR_MESSAGES.lname;
  }
  if (!phone || !phone.match(/^\d{10}$/)) {
    errors.phone = ERROR_MESSAGES.phone;
  }
  if (typeof adults !== "number" || adults < 1 || adults == null) {
    errors.adults = ERROR_MESSAGES.adults;
  }
  if (typeof kids !== "number" || kids < 0) {
    errors.kids = ERROR_MESSAGES.kids;
  }
  if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    errors.date = ERROR_MESSAGES.date;
  }
  if (typeof startTime !== "number" || startTime < 0 || startTime > 1439) {
    errors.startTime = ERROR_MESSAGES.startTime;
  }

  if (typeof endTime !== "number" || endTime < 0 || endTime > 1439) {
    errors.endTime = ERROR_MESSAGES.endTime;
  }
  if (reservation.endTime - reservation.startTime < 30) {
    errors.endTime = ERROR_MESSAGES.reservationDurationShort;
  }

  if (reservation.endTime - reservation.startTime > 240) {
    errors.endTime = ERROR_MESSAGES.reservationDurationLong;
  }

  if (typeof tables !== "number" || tables < 0) {
    errors.tables = ERROR_MESSAGES.tables;
  }
  if (typeof tables == "number" || tables > 0) {
    errors.tables = ERROR_MESSAGES.table;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function ReservationForm() {
  const [name, setName] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [adults, setAdults] = useState("");
  const [kids, setKids] = useState("");
  const [tables, setTables] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  function handleStartTimeChange(event) {
    setStartTime(timeToMinutes(event.target.value));
  }

  function handleEndTimeChange(event) {
    setEndTime(timeToMinutes(event.target.value));
  }


  function resetForm() {
    setName("");
    setLname("");
    setPhone("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setAdults("");
    setKids("");
    setTables("");
    setErrors({});
  }

  const [addReservation] = useMutation(ADD_RESERVATION, {
    update(cache, { data: { addReservation } }) {
      const { reservations } = cache.readQuery({ query: GET_RESERVATIONS });
      cache.writeQuery({
        query: GET_RESERVATIONS,
        data: { reservations: [...reservations, addReservation] },
      });
      setSuccess(true);
      resetForm();
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    const reservation = {
      name,
      lname,
      phone,
      adults: Number(adults),
      kids: Number(kids),
      date,
      startTime: Number(startTime),
      endTime: Number(endTime),
      tables: Number(tables),
    };
    const errors = validateReservation(reservation, []);
    if (errors) {
      setErrors(errors);
    } else {
      addReservation({ variables: { reservation } });
    }
  } 

  const { data: { reservations = [] } = {} } = useQuery(GET_RESERVATIONS);
  const id = reservations.length ? reservations[0]?.id || "" : "";
  const { data, loading, refetch } = useQuery(GET_RESERVATION, {
    variables: { id },
  });

  return (
    <div className="container">
      <h1>Restaurant Reservation</h1>
      {success ? (
        <p>Reservation successful!</p>
      ) : (
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <input
            type="text"
            name="FirstName"
            minLength="3"
            placeholder="First Name"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          {errors.name && <span className="error">{errors.name}</span>}
          <input
            type="text"
            name="lname"
            minLength="3"
            placeholder="Last Name"
            onChange={(event) => {
              setLname(event.target.value);
            }}
          />
          {errors.lname && <span className="error">{errors.lname}</span>}
          <input
            type="tel"
            placeholder="Telephone Number"
            minLength="5"
            onChange={(event) => {
              setPhone(event.target.value);
            }}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
          <input
            type="date"
            name="date"
            onChange={(event) => {
              setDate(event.target.value);
            }}
          />
          {errors.date && <span className="error">{errors.date}</span>}

          <input
            type="time"
            value={`${String(Math.floor(startTime / 60)).padStart(
              2,
              "0"
            )}:${String(startTime % 60).padStart(2, "0")}`}
            onChange={handleStartTimeChange}
          />
          {errors.startTime && (
            <span className="error">{errors.startTime}</span>
          )}

          <input
            type="time"
            value={`${String(Math.floor(endTime / 60)).padStart(
              2,
              "0"
            )}:${String(endTime % 60).padStart(2, "0")}`}
            onChange={handleEndTimeChange}
          />
          {errors.endTime && <span className="error">{errors.endTime}</span>}

          <input
            type="number"
            placeholder="No. of adults"
            minLength="1"
            onChange={(event) => {
              setAdults(parseInt(event.target.value));
            }}
          />
          {errors.adults && <span className="error">{errors.adults}</span>}
          <input
            type="number"
            placeholder="No. of children"
            onChange={(event) => {
              setKids(parseInt(event.target.value));
            }}
          />
          {errors.kids && <span className="error">{errors.kids}</span>}
          <input
            type="number"
            placeholder="Table"
            onChange={(event) => {
              setTables(event.target.value);
            }}
          />
          {errors.tables && <span className="error">{errors.tables}</span>}
          <button
            className="btn"
            onClick={() => {
              addReservation({
                variables: {
                  reservation: {
                    name,
                    lname,
                    phone,
                    date,
                    startTime: parseInt(startTime),
                    endTime: parseInt(endTime),
                    adults: parseInt(adults), // Ensure the variable is an integer
                    kids: parseInt(kids), // Ensure the variable is an integer
                    tables: parseInt(tables),
                  },
                },
              });
            }}
          >
            Add Reservation
          </button>
        </div>
      </form>
      )}
    </div>
  );
}

export default ReservationForm;

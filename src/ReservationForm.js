import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
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

  // const { data, loading, refetch} = useQuery(GET_RESERVATION);
  // const { data:id } = useQuery(GET_RESERVATIONS);

  const { data: { reservations = [] } = {} } = useQuery(GET_RESERVATIONS, {
    onError: () => {},
  });
  const id = reservations.length ? reservations[0]?.id || "" : "";
  const { data, loading, refetch } = useQuery(GET_RESERVATION, {
    variables: { id },
  });

  const [addReservation] = useMutation(ADD_RESERVATION);

  return (
    <div className="container">
      <h1>Restaurant Reservation</h1>
      <div className="inputs">
        <input
          type="text"
          name="FirstName"
          placeholder="First Name"
          onChange={(event) => {
            setName(event.target.value);
          }}
          required
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          onChange={(event) => {
            setLname(event.target.value);
          }}
          required
        />
        <input
          type="tel"
          placeholder="Telephone Number"
          minLength="5"
          onChange={(event) => {
            setPhone(event.target.value);
          }}
          required
        />
        <input
          type="date"
          name="date"
          onChange={(event) => {
            setDate(event.target.value);
          }}
          required
        />
        <input
          type="time"
          onChange={(event) => {
            setStartTime(parseInt(event.target.value.split(":")[0]));
          }}
          required
        />
        <input
          type="time"
          onChange={(event) => {
            setEndTime(parseInt(event.target.value.split(":")[0]));
          }}
          required
        />
        <input
          type="number"
          placeholder="No. of adults"
          onChange={(event) => {
            setAdults(parseInt(event.target.value));
          }}
          required
        />
        <input
          type="number"
          placeholder="No. of children"
          onChange={(event) => {
            setKids(parseInt(event.target.value));
          }}
          required
        />
        <input
          type="number"
          placeholder="Tabel"
          onChange={(event) => {
            setTables(event.target.value);
          }}
          required
        />
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
                  tables: parseInt(tables), // Ensure the variable is an integer
                },
              },
            });
            refetch();
          }}
        >
          Add Reservation
        </button>
      </div>
    </div>
  );
}

export default ReservationForm;

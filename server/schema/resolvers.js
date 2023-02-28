// const _ = require("lodash");

// const reservations = [];

// function validateReservation(reservation) {
//   if (reservation.name.length < 3) {
//     throw new Error('Name must be at least 3 characters long');
//   }

//   if (reservation.phone.length < 5) {
//     throw new Error('Phone number must be at least 5 characters long');
//   }

//   if (!reservation.phone.startsWith('+') && !/^\d/.test(reservation.phone)) {
//     throw new Error('Phone number must start with "+" or a number');
//   }

//   if (!/\d$/.test(reservation.phone)) {
//     throw new Error('Phone number must end with a number');
//   }

//   if (reservation.adults < 1) {
//     throw new Error('There must be at least 1 adult');
//   }

//   if (reservation.kids < 0) {
//     throw new Error('Kids count can\'t be negative');
//   }

//   if (reservation.startTime < 0 || reservation.startTime > 1439) {
//     throw new Error('Invalid start time');
//   }

//   if (reservation.endTime < 0 || reservation.endTime > 1439) {
//     throw new Error('Invalid end time');
//   }

//   if (reservation.endTime - reservation.startTime < 30) {
//     throw new Error('Reservation duration must be at least 30 minutes');
//   }

//   if (reservation.endTime - reservation.startTime > 240) {
//     throw new Error('Reservation duration can\'t be longer than 4 hours');
//   }

//   for (const table of reservation.tables) {
//     for (const existingReservation of reservations) {
//       if (existingReservation.archived) {
//         continue;
//       }

//       if (existingReservation.tables.includes(table) && existingReservation.date === reservation.date) {
//         if (
//           (reservation.startTime >= existingReservation.startTime && reservation.startTime < existingReservation.endTime) ||
//           (reservation.endTime > existingReservation.startTime && reservation.endTime <= existingReservation.endTime)
//         ) {
//           throw new Error(`Table ${table} is already reserved at this time`);
//         }
//       }
//     }
//   }
// }

// const resolvers = {
//   Query: {
//     reservations: () => reservations,
//     reservation: (parent, { id }) => reservations.find(reservation => reservation.id === id)
//   },
//   Mutation: {
//     addReservation: (parent, { reservation }) => {
//       const newReservation = { id: reservations.length.toString(), ...reservation };
//       validateReservation(newReservation);
//       reservations.push(newReservation);
//       return newReservation;
//     },
//     updateReservation: (parent, { id, reservation }) => {
//       const index = reservations.findIndex(existingReservation => existingReservation.id === id);

//   if (index === -1) {
//     throw new Error('Reservation not found');
//   }

//   const existingReservation = reservations[index];

//   if (existingReservation.archived) {
//     throw new Error('Archived reservations can\'t be updated');
//   }

//   const editedReservation = { id, ...reservation, archived: true };
//   validateReservation(editedReservation);
//   editedReservation.archived = existingReservation.archived;
//   reservations.splice(index, 1, editedReservation);
//   return editedReservation;
// },
// cancelReservation: (parent, { id }) => {
//   const index = reservations.findIndex(existingReservation => existingReservation.id === id);

//   if (index === -1) {
//     throw new Error('Reservation not found');
//   }

//   const existingReservation = reservations[index];

//   if (existingReservation.archived) {
//     throw new Error('Archived reservations can\'t be canceled');
//   }

//   existingReservation.archived = true;
//   reservations.splice(index, 1, existingReservation);
//   return existingReservation;
// },
// archiveReservation: (parent, { id }) => {
//   const index = reservations.findIndex(existingReservation => existingReservation.id === id);

//   if (index === -1) {
//     throw new Error('Reservation not found');
//   }

//   const existingReservation = reservations[index];

//   if (existingReservation.archived) {
//     throw new Error('Archived reservations can\'t be archived again');
//   }

//   existingReservation.archived = true;
//   reservations.splice(index, 1, existingReservation);
//   return existingReservation;
// }
// }
// };

// module.exports = { resolvers };

const reservations = [];
let lastReservationId = 0;

const resolvers = {
  Query: {
    reservations: () => reservations,
    reservation: (parent, { id }) =>
      reservations.find((reservation) => reservation.id === id),
  },
  Mutation: {
    addReservation: (parent, { reservation }) => {
      validateReservation(reservation);
      const newReservation = {
        id: String(lastReservationId++),
        ...reservation,
        archived: false, // set the archived field to a default value
      };
      reservations.push(newReservation);
      return newReservation;
    },

    updateReservation: (parent, { id, reservation }) => {
      const existingReservation = reservations.find(
        (reservation) => reservation.id === id
      );
      if (!existingReservation) {
        throw new Error(`Reservation with id ${id} not found`);
      }
      if (existingReservation.archived) {
        throw new Error(
          `Cannot update archived reservation with id ${existingReservation.id}`
        );
      }
      validateReservation({ ...existingReservation, ...reservation });
      const updatedReservation = { ...existingReservation, ...reservation };
      reservations.splice(
        reservations.findIndex((reservation) => reservation.id === id),
        1,
        updatedReservation
      );
      return updatedReservation;
    },
    cancelReservation: (parent, { id }) => {
      const existingReservation = reservations.find(
        (reservation) => reservation.id === id
      );
      if (!existingReservation) {
        throw new Error(`Reservation with id ${id} not found`);
      }
      if (existingReservation.archived) {
        throw new Error(
          `Cannot cancel archived reservation with id ${existingReservation.id}`
        );
      }
      reservations.splice(
        reservations.findIndex((reservation) => reservation.id === id),
        1
      );
      return existingReservation;
    },
    archiveReservation: (parent, { id }) => {
      const existingReservation = reservations.find(
        (reservation) => reservation.id === id
      );
      if (!existingReservation) {
        throw new Error(`Reservation with id ${id} not found`);
      }
      const archivedReservation = {
        ...existingReservation,
        archived: true,
      };
      reservations.splice(
        reservations.findIndex((reservation) => reservation.id === id),
        1,
        archivedReservation
      );
      return archivedReservation;
    },
  },
};

function validateReservation(reservation) {
  const { name, lname, phone, adults, kids, date, startTime, endTime, tables } =
    reservation;
  if (!name || name.length < 3) {
    throw new Error(
      "Name is required and should be at least 3 characters long"
    );
  }
  if (!lname || lname.length < 3) {
    throw new Error(
      "Last name is required and should be at least 3 characters long"
    );
  }
  if (!phone || !phone.match(/^\d{10}$/)) {
    throw new Error("Phone number is required and should be 10 digits long");
  }
  if (typeof adults !== "number" || adults < 1) {
    throw new Error("Number of adults is required and should be at least 1");
  }
  if (typeof kids !== "number" || kids < 0) {
    throw new Error("Number of kids should be a positive number or 0");
  }
  if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error("Date is required and should be in the format YYYY-MM-DD");
  }
  if (typeof startTime !== "number" || startTime < 0 || startTime > 23) {
    throw new Error(
      "Start time is required and should be a number between 0 and 23"
    );
  }
  if (typeof endTime !== "number" || endTime < 0 || endTime > 23) {
    throw new Error(
      "End time is required and should be a number between 0 and 23"
    );
  }
  if (!tables || !Array.isArray(tables) || tables.length < 1) {
    throw new Error("At least one table is required");
  }
  tables.forEach((table) => {
    if (typeof table !== "number" || table < 1) {
      throw new Error("Table numbers should be positive numbers");
    }
  });
}

module.exports = { resolvers };

const { gql } = require("apollo-server");
const { GraphQLScalarType } = require('graphql');


const typeDefs = gql`
  scalar Date
  scalar Time
  type Reservation {
    id: ID!
    name: String!
    lname: String!
    phone: String!
    adults: Int!
    kids: Int!
    date: String!
    startTime: Int!
    endTime: Int!
    tables: [Int!]!
    archived: Boolean!
  }

  input ReservationInput {
    name: String!
    lname: String!
    phone: String!
    adults: Int!
    kids: Int!
    date: String!
    startTime: Int!
    endTime: Int!
    tables: [Int!]!
    archived: Boolean
  }

  type Query {
    reservations: [Reservation!]!
    reservation(id: ID!): Reservation
  }

  type Mutation {
    addReservation(reservation: ReservationInput!): Reservation!
    updateReservation(id: ID!, reservation: ReservationInput!): Reservation!
    cancelReservation(id: ID!): Reservation!
    archiveReservation(id: ID!): Reservation!
  }
`;

module.exports = { typeDefs };
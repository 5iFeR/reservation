const { validateReservation } = require("./src/schema/resolvers");

describe("validateReservation", () => {
  const mockReservation = {
    name: "John",
    lname: "Doe",
    phone: "1234567890",
    adults: 2,
    kids: 1,
    date: "2023-03-06",
    startTime: 720,
    endTime: 900,
    tables: [1, 2],
  };

  it("throws an error if name is missing", () => {
    const reservation = { ...mockReservation, name: "" };
    expect(() => validateReservation(reservation)).toThrowError(
      "Name is required"
    );
  });

  it("throws an error if name is too short", () => {
    const reservation = { ...mockReservation, name: "Jo" };
    expect(() => validateReservation(reservation)).toThrowError(
      "at least 3 characters long"
    );
  });

  it("throws an error if last name is missing", () => {
    const reservation = { ...mockReservation, lname: "" };
    expect(() => validateReservation(reservation)).toThrowError(
      "Last name is required"
    );
  });

  it("throws an error if last name is too short", () => {
    const reservation = { ...mockReservation, lname: "Do" };
    expect(() => validateReservation(reservation)).toThrowError(
      "at least 3 characters long"
    );
  });

  it("throws an error if phone number is missing", () => {
    const reservation = { ...mockReservation, phone: "" };
    expect(() => validateReservation(reservation)).toThrowError(
      "Phone number is required"
    );
  });

  it("throws an error if phone number is invalid", () => {
    const reservation = { ...mockReservation, phone: "123456789" };
    expect(() => validateReservation(reservation)).toThrowError(
      "10 digits long"
    );
  });

  it("throws an error if number of adults is missing", () => {
    const reservation = { ...mockReservation, adults: undefined };
    expect(() => validateReservation(reservation)).toThrowError(
      "Number of adults is required"
    );
  });

  it("throws an error if number of adults is less than 1", () => {
    const reservation = { ...mockReservation, adults: 0 };
    expect(() => validateReservation(reservation)).toThrowError("at least 1");
  });

  it("throws an error if number of kids is negative", () => {
    const reservation = { ...mockReservation, kids: -1 };
    expect(() => validateReservation(reservation)).toThrowError(
      "should be a positive number or 0"
    );
  });

  it("throws an error if date is missing", () => {
    const reservation = { ...mockReservation, date: "" };
    expect(() => validateReservation(reservation)).toThrowError(
      "Date is required"
    );
  });

  it("throws an error if date is invalid", () => {
    const reservation = { ...mockReservation, date: "2023/03/06" };
    expect(() => validateReservation(reservation)).toThrowError(
      "in the format YYYY-MM-DD"
    );
  });

  it("throws an error if start time is missing", () => {
    const reservation = { ...mockReservation, startTime: undefined };
    expect(() => validateReservation(reservation)).toThrowError(
      "Start time is required"
    );
  });

  it("throws an error if start time is less than 0", () => {
    const reservation = { ...mockReservation, startTime: -1 };
    expect(() => validateReservation(reservation)).toThrowError(
      "Start time is required and should be a number between 0 and 23"
    );
  });

  it("throws an error if start time is greater than or equal to end time", () => {
    const reservation = { ...mockReservation, startTime: 900, endTime: 720 };
    expect(() => validateReservation(reservation)).toThrowError(
      "Reservation duration must be at least 30 minutes"
    );
  });

  it("throws an error if end time is missing", () => {
    const reservation = { ...mockReservation, endTime: undefined };
    expect(() => validateReservation(reservation)).toThrowError(
      "End time is required"
    );
  });

  it("throws an error if end time is greater than or equal to 1440", () => {
    const reservation = { ...mockReservation, endTime: 1440 };
    expect(() => validateReservation(reservation)).toThrowError(
      "End time is required and should be a number between 0 and 23"
    );
  });

  it("throws an error if tables are missing", () => {
    const reservation = { ...mockReservation, tables: undefined };
    expect(() => validateReservation(reservation)).toThrowError(
      "reservation.tables is not iterable"
    );
  });

  it("throws an error if tables are not an array", () => {
    const reservation = { ...mockReservation, tables: 1 };
    expect(() => validateReservation(reservation)).toThrowError(
      "reservation.tables is not iterable"
    );
  });

  it("throws an error if tables are an empty array", () => {
    const reservation = { ...mockReservation, tables: [] };
    expect(() => validateReservation(reservation)).toThrowError(
      "At least one table is required"
    );
  });

  it("does not throw an error if all fields are valid", () => {
    expect(() => validateReservation(mockReservation)).not.toThrowError();
  });
});

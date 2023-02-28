import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ReservationForm from "./ReservationForm";

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/",
  });
  return (
    <ApolloProvider client={client}>
      <ReservationForm />
    </ApolloProvider>
  );
}

export default App;

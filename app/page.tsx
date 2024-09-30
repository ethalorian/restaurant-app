import Hero from "@/components/hero";
import Restaurants from "@/components/restaurants";
import React from "react";
import RestaurantPartners from "@/components/restaurant-partners";

export default async function Index() {
  return (
    <>
      <Hero />
      <RestaurantPartners />
    </>
  );
}
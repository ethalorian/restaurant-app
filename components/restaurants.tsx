import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Restaurant {
    id: number; // or string, depending on your data
    name: string;
    city: string;
    state: string;
    price_tier: string;
    street_address: string;
    image_url: string;
}

const fetchRestaurants = async (): Promise<Restaurant[]> => {
    try {
        const response = await fetch('https://vjbicbyggcrdejrwwzqn.supabase.co/rest/v1/restaurants', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY!, // Ensure this is the correct API key
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return []; // Return an empty array or handle the error as needed
    }
};

const Restaurants = async () => {
    const restaurants = await fetchRestaurants();

    return (
        <div className="col-span-2 md:col-start-1 w-full mx-auto"> {/* Set width to half and center */}
            <Carousel autoScroll={true}>
                <CarouselPrevious />
                <CarouselContent>
                    {restaurants.length > 0 ? (
                        restaurants.map((restaurant) => (
                            <CarouselItem key={restaurant.id}>
                                <h3 className="text-center text-4xl mt-2 mb-2">{restaurant.name}</h3>
                                <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-auto rounded-xl " /> {/* Maintain aspect ratio */}
                                <h3 className="text-center text-xl mt-2">{restaurant.street_address}</h3>
                                <h3 className="text-center text-xl mt-2">{restaurant.city}, {restaurant.state}</h3>
                                <h3 className="text-center text-xl mt-2">{restaurant.price_tier}</h3>
                            </CarouselItem>
                        ))
                    ) : (
                        <CarouselItem>
                            <h3>No restaurants found.</h3>
                        </CarouselItem>
                    )}
                </CarouselContent>
                <CarouselNext />
            </Carousel>
        </div> // Closing the wrapper div
    );
};
export default Restaurants;
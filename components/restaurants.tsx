import React from 'react';

interface Restaurant {
    id: number; // or string, depending on your data
    name: string;
}

const fetchRestaurants = async (): Promise<Restaurant[]> => {
    try {
        const response = await fetch('https://vjbicbyggcrdejrwwzqn.supabase.co/rest/v1/restaurants', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY, // Ensure this is the correct API key
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
        <ul>
            {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                    <li key={restaurant.id}>{restaurant.name}</li>
                ))
            ) : (
                <li>No restaurants found.</li>
            )}
        </ul>
    );
};

export default Restaurants;
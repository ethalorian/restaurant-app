"use client"

import React, { useState, useEffect } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface Restaurant {
    id: number;
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

const RestaurantPartners: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const loadRestaurants = async () => {
            const data = await fetchRestaurants();
            setRestaurants(data);
        };
        loadRestaurants();
    }, []);

    return (
        <div className="flex justify-center w-full">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full max-w-2xl">
                <CollapsibleTrigger className="flex items-center justify-center w-full p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                    <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">A List of our Restaurant Partners</h2>
                    <span className="ml-2 text-neutral-600 dark:text-neutral-400">{isOpen ? '▲' : '▼'}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-white dark:bg-neutral-900 p-4 mt-4 rounded-md shadow">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="mb-4 p-2 border-b border-neutral-200 dark:border-neutral-700 text-center">
                            <img 
                                src={restaurant.image_url} 
                                alt={restaurant.name} 
                                className="w-24 h-24 object-cover mx-auto mb-2 rounded-full"
                            />
                            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{restaurant.name}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">{restaurant.street_address}</p>
                            <p className="text-neutral-600 dark:text-neutral-400">{restaurant.city}, {restaurant.state}</p>
                            <p className="text-neutral-600 dark:text-neutral-400">Price: {restaurant.price_tier}</p>
                        </div>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default RestaurantPartners;
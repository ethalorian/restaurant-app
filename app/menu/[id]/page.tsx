'use client';

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface MenuItem {
  id: number;
  menu_id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

interface Restaurant {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  restaurant_id: number;
  menu_type: string;
}

export default function MenuPage() {
  const params = useParams()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [restaurantName, setRestaurantName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        if (!params.id) {
          throw new Error('No restaurant name provided');
        }

        const decodedRestaurantName = decodeURIComponent(params.id as string);
        setRestaurantName(decodedRestaurantName);
        console.log("Fetching restaurant:", decodedRestaurantName);

        // First, fetch the restaurant by name
        const restaurantResponse = await fetch(`https://vjbicbyggcrdejrwwzqn.supabase.co/rest/v1/restaurants?name=eq.${decodedRestaurantName}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
          },
        });

        if (!restaurantResponse.ok) {
          throw new Error(`Failed to fetch restaurant: ${restaurantResponse.statusText}`);
        }

        const restaurants: Restaurant[] = await restaurantResponse.json();
        console.log("Fetched restaurants:", restaurants);
        
        if (restaurants.length === 0) {
          throw new Error('No restaurant found with this name');
        }

        const restaurantId = restaurants[0].id;

        // Then, fetch the menu for this restaurant
        const menuResponse = await fetch(`https://vjbicbyggcrdejrwwzqn.supabase.co/rest/v1/menus?restaurant_id=eq.${restaurantId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
          },
        });

        if (!menuResponse.ok) {
          throw new Error(`Failed to fetch menu: ${menuResponse.statusText}`);
        }

        const menus: Menu[] = await menuResponse.json();
        console.log("Fetched menus:", menus);

        if (menus.length === 0) {
          throw new Error('No menu found for this restaurant');
        }

        const menuId = menus[0].id;

        // Finally, fetch all menu items and filter them
        const menuItemsResponse = await fetch(`https://vjbicbyggcrdejrwwzqn.supabase.co/rest/v1/menu_items`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
          },
        });

        if (!menuItemsResponse.ok) {
          throw new Error('Failed to fetch menu items');
        }

        const allMenuItems: MenuItem[] = await menuItemsResponse.json();
        console.log("Fetched all menu items:", allMenuItems);

        const filteredMenuItems = allMenuItems.filter(item => item.menu_id === menuId);
        console.log("Filtered menu items:", filteredMenuItems);

        setMenuItems(filteredMenuItems);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(`Failed to load menu items: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Menu for {restaurantName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-6">
            {item.image_url && (
              <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover mb-4 rounded" />
            )}
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-2">{item.category}</p>
            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
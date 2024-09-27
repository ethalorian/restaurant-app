'use client';

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { RestaurantCombobox } from '@/components/restSearch';

interface MenuItem {
  id: number;
  menu_id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

interface Menu {
  id: number;
  restaurant_id: number;
  menu_type: string;
}

interface Restaurant {
  id: number;
  name: string;
}

interface GroupedMenuItems {
  [menuType: string]: {
    [category: string]: MenuItem[];
  };
}

export default function MenuPage() {
  const params = useParams()
  const [menuItems, setMenuItems] = useState<GroupedMenuItems>({})
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

        // Fetch the restaurant by name
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
        
        if (restaurants.length === 0) {
          throw new Error('No restaurant found with this name');
        }

        const restaurantId = restaurants[0].id;

        // Fetch menus for this restaurant
        const menusResponse = await fetch(`https://vjbicbyggcrdejrwwzqn.supabase.co/rest/v1/menus?restaurant_id=eq.${restaurantId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
          },
        });

        if (!menusResponse.ok) {
          throw new Error(`Failed to fetch menus: ${menusResponse.statusText}`);
        }

        const menus: Menu[] = await menusResponse.json();

        // Fetch menu items for all menus of this restaurant
        const menuItemPromises = menus.map(menu => 
          fetch(`https://vjbicbyggcrdejrwwzqn.supabase.co/rest/v1/menu_items?menu_id=eq.${menu.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
            },
          }).then(res => res.json())
        );

        const menuItemsArrays = await Promise.all(menuItemPromises);
        const allMenuItems = menuItemsArrays.flat();

        // Group menu items by menu type and category
        const groupedMenuItems = menus.reduce((acc, menu) => {
          acc[menu.menu_type] = allMenuItems
            .filter(item => item.menu_id === menu.id)
            .reduce((categoryAcc, item) => {
              if (!categoryAcc[item.category]) {
                categoryAcc[item.category] = [];
              }
              categoryAcc[item.category].push(item);
              return categoryAcc;
            }, {} as { [category: string]: MenuItem[] });
          return acc;
        }, {} as GroupedMenuItems);

        setMenuItems(groupedMenuItems);
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

  const sortCategories = (a: [string, MenuItem[]], b: [string, MenuItem[]]) => {
    const order = ["Appetizer", "Main Course", "Dessert"];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  };

  if (loading) return <div className="text-foreground font-medium">Loading...</div>;
  if (error) return <div className="text-destructive font-medium">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-primary">{restaurantName}&apos;s Menu</h1>
      <RestaurantCombobox />
      {Object.entries(menuItems).map(([menuType, categories]) => (
        <div key={menuType} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-primary">{menuType}</h2>
          {Object.entries(categories)
            .sort(sortCategories)
            .map(([category, items]) => (
              // Only render the category if it has items
              items.length > 0 && (
                <div key={category} className="mb-8">
                  <h3 className="text-2xl font-medium mb-4 text-secondary-foreground">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-card text-card-foreground shadow-md rounded-lg p-6">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover mb-4 rounded" />
                        )}
                        <h4 className="text-lg font-medium mb-2">{item.name}</h4>
                        <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
        </div>
      ))}
    </div>
  );
}
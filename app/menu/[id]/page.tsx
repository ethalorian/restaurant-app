'use client';

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { RestaurantCombobox } from '@/components/restSearch';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { Button } from '@/components/ui/button';
import { AuthPrompt } from '@/components/auth-prompt';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Fuse from 'fuse.js';

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
  image_url: string;
}

interface GroupedMenuItems {
  [menuType: string]: {
    [category: string]: MenuItem[];
  };
}

export default function MenuPage() {
  const params = useParams()
  const { menuItems, setMenuItems, addToCart } = useShoppingCart();
  const [restaurantName, setRestaurantName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState<GroupedMenuItems>({});
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    handleResize(); // Set initial height
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
  }, []);

  useEffect(() => {
    const fetchRestaurantData = async () => {
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

        setRestaurant(restaurants[0]);

        // ... existing code to fetch menu items ...

      } catch (err) {
        // ... existing error handling ...
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [params.id, setMenuItems]); 
  
  
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
  }, [params.id, setMenuItems]);

  useEffect(() => {
    if (!menuItems) return;

    const allItems = Object.values(menuItems).flatMap(categories => 
      Object.values(categories).flat()
    );

    const fuse = new Fuse(allItems, {
      keys: ['name', 'category'],
      threshold: 0.4,
    });

    const searchResults = searchQuery
      ? fuse.search(searchQuery).map(result => result.item)
      : allItems;

    const newFilteredItems = searchResults.reduce((acc, item) => {
      const menuType = Object.keys(menuItems).find(type => 
        Object.values(menuItems[type]).some(category => category.includes(item))
      ) || '';

      if (!acc[menuType]) acc[menuType] = {};
      if (!acc[menuType][item.category]) acc[menuType][item.category] = [];
      acc[menuType][item.category].push(item);
      return acc;
    }, {} as GroupedMenuItems);

    setFilteredMenuItems(newFilteredItems);
  }, [searchQuery, menuItems]);

  const handleAddToCart = (item: MenuItem) => {
    if (user) {
      addToCart(item);
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart.`,
        duration: 5000,
        className: "max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[75vw] xl:max-w-[60vw]",
      });
    } else {
      setIsAuthPromptOpen(true);
    }
  };

  const sortCategories = (a: [string, MenuItem[]], b: [string, MenuItem[]]) => {
    const order = ["Appetizer", "Main Course", "Dessert"];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  };

  if (loading) return <div className="text-foreground font-medium h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-destructive font-medium h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-2 bg-background text-foreground overflow-y-auto flex flex-col h-screen">
      <div className="flex-none mb-4 h-[calc(33vh-4rem)] flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-primary text-center">{restaurantName}</h1>
        <div className="mb-2 w-full flex justify-center max-w-xs">
          <RestaurantCombobox />
        </div>
        {restaurant && restaurant.image_url && (
          <div className="mb-2 w-24 h-24 sm:w-32 sm:h-32">
            <Image
              src={restaurant.image_url}
              alt={restaurantName}
              width={256}
              height={256}
              priority
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
        )}
        <div className="mb-2 w-full max-w-xs">
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
      <ScrollArea className="flex-grow">
      {Object.entries(filteredMenuItems).map(([menuType, categories]) => (
        <div key={menuType} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 mt-6 text-primary">{menuType}</h2>
          {Object.entries(categories)
            .sort(sortCategories)
            .map(([category, items]) => (
              items.length > 0 && (
                <div key={category} className="mb-8">
                  <h3 className="text-2xl font-medium mb-4 text-secondary-foreground">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <Card key={item.id} className="relative pb-16">
                        <CardHeader>
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover mb-4 rounded" />
                          )}
                          <CardTitle>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                        </CardContent>
                        <CardFooter className="absolute bottom-0 left-0 right-0 p-4">
                          <Button 
                            onClick={() => handleAddToCart(item)} 
                            className="w-full"
                          >
                            Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            ))}
        </div>
      ))}
      </ScrollArea>
      <AuthPrompt 
        isOpen={isAuthPromptOpen} 
        onClose={() => setIsAuthPromptOpen(false)} 
      />
    </div>
  );
}
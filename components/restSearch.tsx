"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// The Restaurant interface based on the data structure
interface Restaurant {
  id: number | string;
  name: string;
  city: string;
  state: string;
  price_tier: string;
  street_address: string;
  image_url: string;
}

// Function to fetch restaurants from the API
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

// Fuzzy search helper function
const fuzzySearch = (input: string, restaurantName: string) => {
  const lowerInput = input.toLowerCase();
  const lowerRestaurantName = restaurantName.toLowerCase();
  return lowerRestaurantName.includes(lowerInput);
};

export function RestSearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>("")
  const [searchTerm, setSearchTerm] = React.useState<string>("") // State to track the search term
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]) // State to store the fetched restaurants

  // Fetch the restaurants when the component mounts
  React.useEffect(() => {
    const loadRestaurants = async () => {
      const fetchedRestaurants = await fetchRestaurants();
      setRestaurants(fetchedRestaurants); // Store the fetched restaurants
    };
    loadRestaurants();
  }, []);

  // Filter restaurants based on the search term using fuzzy search
  const filteredRestaurants = restaurants.filter((restaurant) =>
    fuzzySearch(searchTerm, restaurant.name)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? restaurants.find((restaurant) => restaurant.id === value)?.name
            : "Select restaurant..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search restaurant..."
            value={searchTerm} // Bind the search input value
            onInput={(e) => setSearchTerm(e.currentTarget.value)} // Track search term changes
          />
          <CommandList>
            {filteredRestaurants.length === 0 ? (
              <CommandEmpty>No restaurant found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredRestaurants.map((restaurant) => (
                  <CommandItem
                    key={restaurant.id}
                    value={String(restaurant.id)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(restaurant.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {restaurant.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

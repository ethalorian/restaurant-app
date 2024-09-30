'use client';

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ShoppingCart as ShoppingCartIcon, Minus, Plus, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { useShoppingCart } from "@/contexts/ShoppingCartContext"
import { useState, useEffect } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeProvider } from "@/app/stripe-provider";
import { StripePaymentForm } from "./stripe-payment-form";

export function ShoppingCart() {
  const { cartItems, removeFromCart, addToCart } = useShoppingCart()
  const [subtotal, setSubtotal] = useState(0)
  const serviceFeeRate = 0.035 // 3.5%
  const salesTaxRate = 0.065 // 6.5%
 
  // Calculate total number of items in the cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const newSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    setSubtotal(newSubtotal)
  }, [cartItems])

  const serviceFee = subtotal * serviceFeeRate
  const salesTax = subtotal * salesTaxRate
  const total = subtotal + serviceFee + salesTax


  return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCartIcon className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
          <div className="flex flex-col gap-4 py-4">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => removeFromCart(item.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal for {totalItems} item{totalItems !== 1 ? 's' : ''}:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee (3.5%):</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (6.5%):</span>
              <span>${salesTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <SheetFooter className="mt-4 flex justify-center">
            <StripeProvider total={total}>
              <StripePaymentForm total={total} />
            </StripeProvider>
          </SheetFooter>
          </ScrollArea>
        </SheetContent>
      </Sheet>
  );
}
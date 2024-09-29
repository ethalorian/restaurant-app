import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Check if the user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && !user) {
      // Store the current URL as the intended destination
      const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
      return NextResponse.redirect(new URL(`/sign-in?redirectTo=${encodeURIComponent(currentUrl)}`, request.url));
    }

    // Remove automatic redirection after sign-in
    // if (request.nextUrl.pathname === "/" && user) {
    //   return NextResponse.redirect(new URL("/protected", request.url));
    // }

    return response;
  } catch (e) {
    console.error("Supabase client error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
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
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

   // Get the intended destination from the request's search params
   const intendedDestination = request.nextUrl.searchParams.get('redirectTo') || '/protected';

   // protected routes
   if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
     // Store the current URL as the intended destination
     const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
     return NextResponse.redirect(new URL(`/sign-in?redirectTo=${encodeURIComponent(currentUrl)}`, request.url));
   }

   if (request.nextUrl.pathname === "/" && !user.error) {
     // Redirect to the intended destination after sign-in
     return NextResponse.redirect(new URL(intendedDestination, request.url));
   }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

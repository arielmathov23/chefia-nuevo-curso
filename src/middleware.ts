import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create Supabase client with cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          const setCookie = res.headers.get('set-cookie');
          if (setCookie) {
            res.headers.set('set-cookie', setCookie);
          }
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          const setCookie = res.headers.get('set-cookie');
          if (setCookie) {
            res.headers.set('set-cookie', setCookie);
          }
        },
      },
    }
  );
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the route should be protected
  const protectedRoutes = ['/inventory', '/recipes', '/preferences'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // If the route is protected and the user isn't authenticated,
  // redirect to the login page
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is authenticated and trying to access auth pages,
  // redirect to the home page
  if (session && (
    req.nextUrl.pathname.startsWith('/auth/login') || 
    req.nextUrl.pathname.startsWith('/auth/signup')
  )) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    // Protected routes
    '/inventory/:path*',
    '/recipes/:path*',
    '/preferences/:path*',
    // Auth routes
    '/auth/:path*',
  ],
}; 
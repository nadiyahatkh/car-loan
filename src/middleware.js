import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // const {pathname} = nexturl;
    const token = req.nextauth.token;
    // const url = nexturl.clone;

    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Prevent role 1 (admin) from accessing the root page "/"
    // if (token) {
    //   return NextResponse.redirect('/submission');
    // }

    // Prevent role 2 from accessing any page other than "/"
    if (token.role === 2 && req.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL('/user/submission-user', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow access if the user has a token
    },
  },
)

export const config = {
  matcher: [
    "/submission", 
    "/user-management",
  ]
}
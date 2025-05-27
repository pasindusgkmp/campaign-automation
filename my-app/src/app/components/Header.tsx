import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const Header: React.FC = async () => {
  const { userId } = await auth();

  return (
    <header className="px-8 py-4 flex justify-between items-center bg-white shadow-sm">
      <div className="text-lg font-semibold text-gray-900">
        Campaigns Automation Platform
      </div>
      <nav className="flex items-center space-x-4">
        {!userId ? (
          <>
            <Link href="/sign-in" className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition">
              Sign In
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link href="/profile" className="px-4 py-2 text-gray-700 hover:text-blue-500">
              Profile
            </Link>
            <UserButton />
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
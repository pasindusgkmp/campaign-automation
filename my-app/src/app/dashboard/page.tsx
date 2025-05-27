import React from "react";
import Link from "next/link";
// If you installed shadcn/ui, the import is usually like this:
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex gap-8">
        <Link href="/scrape" className="no-underline">
          <Card className="w-80 cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-center">Scrape</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Extract contacts and emails to power your outreach.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="#" className="no-underline">
          <Card className="w-80 cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-center">Create Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Design, schedule, and automate your email campaigns.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
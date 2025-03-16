import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

export default function () {
  return (
    <Card className="p-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Article Simplifier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base">
          Get started:
        </p>
        
        <Button
          variant="default"
          size="lg"
          className="w-full"
          asChild
        >
          <Link to="/sign-up">Sign up</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          asChild
        >
          <Link to="/sign-in">Sign in</Link>
        </Button>
        
      </CardContent>
    </Card>
  );
}

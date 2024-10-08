import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function Contact() {
  return (
    <div className="flex h-screen w-screen place-items-center justify-center bg-gray-900">
      <div>
        <form>
          <Card className="mx-auto w-full max-w-6xl h-full mt-10 mb-10 ml-10 mr-10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Contact Form</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mobile Number</Label>
                <Input id="password" type="number" required />
              </div>
              <div>
                <Label htmlFor="email">Message</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter Message"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Contact</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

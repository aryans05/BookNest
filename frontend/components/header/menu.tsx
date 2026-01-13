import Link from "next/link";
import { Button } from "../ui/button";
import { EllipsisVertical, PhoneCallIcon, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const Menu = () => {
  return (
    <div className="flex-justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <Button asChild variant="ghost">
          <Link href="/contact">
            <PhoneCallIcon />
            Contact
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/about">
            <UserIcon />
            About
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className=" align-middle">
            <EllipsisVertical />
            <SheetContent className="flex flex-col items-start">
              <SheetTitle>Menu</SheetTitle>
              <Button asChild variant="ghost">
                <Link href="/contact">
                  <PhoneCallIcon /> Contact
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/about">
                  <UserIcon />
                  About
                </Link>
              </Button>
              <SheetDescription></SheetDescription>
            </SheetContent>
          </SheetTrigger>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;

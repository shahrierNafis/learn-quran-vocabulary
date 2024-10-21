import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BuyMeACoffee from "@/components/BuyMeACoffee";

export default function BuyMeACoffeeDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button
            asChild
            className="bg-[#FFDD00] text-black"
            variant={"outline"}
          >
            <div className="flex gap-2 items-center">
              <Image
                width={12}
                height={12}
                src="/static/buyMeACoffee.svg"
                alt=""
              />
              <div> Buy me a coffee</div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy me a coffee</DialogTitle>
            <DialogDescription>
              <BuyMeACoffee />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

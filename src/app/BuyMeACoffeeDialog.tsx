"use client";
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
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export default function BuyMeACoffeeDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="bg-[#FFDD00] text-black"
              variant={"outline"}
            >
              <div className="flex gap-3 items-center">
                <Image
                  width={12}
                  height={12}
                  src="/static/buyMeACoffee.svg"
                  alt=""
                />
                <div className="">Buy Me A Coffee</div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
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

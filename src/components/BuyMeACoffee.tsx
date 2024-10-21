import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

export default function BuyMeACoffee() {
  const [amount, setAmount] = useState(5);
  const [recurMonthly, setRecurMonthly] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div>
          {" "}
          {[5, 10, 50, 100].map((a) => {
            return (
              <>
                <Button
                  variant={amount == a ? "default" : "outline"}
                  onClick={() => setAmount(a)}
                >
                  ${a}
                </Button>
              </>
            );
          })}
        </div>
        <div className="flex">
          <Button variant={"outline"} disabled>
            $
          </Button>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
          />
        </div>
        <Button
          variant={"outline"}
          onClick={() => setRecurMonthly(!recurMonthly)}
        >
          <Switch checked={recurMonthly} />
          Recur monthly
        </Button>{" "}
        <Button
          onClick={() => {
            window.open(
              `/static/buyMeACoffee.html?orderAmount=${amount}&${recurMonthly && "recurMonthly"}`,
              "_blank",
              "location=yes,scrollbars=yes,status=yes"
            );
          }}
        >
          Continue
        </Button>
      </div>
    </>
  );
}

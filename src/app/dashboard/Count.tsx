import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";

export default function Count() {
  const [count, setCount] = useState(0);
  const supabase = createClient<Database>();
  useEffect(() => {
    supabase
      .rpc("get_todays_count")
      .then(({ data }) => setCount(data?.length ?? 0));
    return () => {};
  }, []);

  return (
    <>
      <div className="flex flex-col w-full flex-grow basis-0 justify-center items-center">
        <div className=""></div>
        <div>{count}</div>
        <div>words learned</div>
        <div>today</div>
      </div>
    </>
  );
}

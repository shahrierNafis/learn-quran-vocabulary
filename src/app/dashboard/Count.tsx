import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/clients";
import React, { useEffect, useState } from "react";

export default function Count() {
  const [count, setCount] = useState(0);
  const supabase = createClient<Database>();
  useEffect(() => {
    supabase
      .from("user_progress")
      .select("updated_at")
      .then(({ data }) =>
        setCount(
          data?.filter(
            (progress) =>
              new Date(progress.updated_at).getDate() === new Date().getDate()
          ).length ?? 0
        )
      );
    return () => {};
  }, [supabase]);

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

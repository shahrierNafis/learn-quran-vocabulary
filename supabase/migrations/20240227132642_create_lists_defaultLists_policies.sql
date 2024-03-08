alter table "public"."default_lists" enable row level security;

create policy "Enable SELECT for authenticated users only"
on "public"."default_lists"
as permissive
for select
to authenticated
using (true);

alter table "public"."lists" enable row level security;

create policy "Enable SELECT for authenticated users only"
on "public"."lists"
as permissive
for select
to authenticated
using (true);

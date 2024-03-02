create policy "Enable SELECT for authenticated users only"
on "public"."default_lists"
as permissive
for select
to authenticated
using (true);


create policy "Enable SELECT for authenticated users only"
on "public"."lists"
as permissive
for select
to authenticated
using (true);

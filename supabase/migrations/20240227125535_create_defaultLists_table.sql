create table
  public."default_lists" (
    id bigint not null,
    constraint default_lists_pkey primary key (id),
    constraint default_lists_id_key unique (id),
    constraint default_lists_id_fkey foreign key (id) references lists (id)
  ) tablespace pg_default;
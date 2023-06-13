import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("first_name");
    table.string("last_name");
    table.string("password");
    table.string("email").unique();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}

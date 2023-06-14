import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return await knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("firstName");
    table.string("lastName");
    table.string("password");
    table.string("email").unique();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("users");
}
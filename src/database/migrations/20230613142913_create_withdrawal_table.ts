import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return await knex.schema.createTable(
    "wallets",
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("userId").references("users.id").onDelete("CASCADE");
      table.integer("balance");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
    }
  );
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("wallets");
}

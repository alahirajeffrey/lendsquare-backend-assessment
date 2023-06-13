import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("sender_wallet_id");
    table.string("reciever_wallet_id");
    table
      .enum("transaction_type", ["fund", "transfer", "withdrawal"])
      .notNullable()
      .defaultTo("fund");
    table.timestamp("transaction_time").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {}

import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return await knex.schema.createTable(
    "transactions",
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table
        .string("senderWalletId")
        .references("wallets.id")
        .onDelete("CASCADE");
      table.string("recieverWalletId");
      table
        .enum("transactionType", ["fund", "transfer", "withdrawal"])
        .notNullable()
        .defaultTo("fund");
      table.timestamp("transactionTime").defaultTo(knex.fn.now());
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}

import { Query } from "../helpers";
import { executeQuery, getRowId, isStored } from "../utils";

export class Account {
  private static table = "account";

  public static async add(data: StoredAccount) {
    const query = new Query()
      .insertInto(this.table)
      .values(
        convertDataForDB(data) as unknown as Record<string, string | number>
      );

    await executeQuery(query, "create account");
  }

  public static async create(puuid: string) {
    const query = new Query().insertInto(this.table).values({ puuid });

    await executeQuery(query, "create unknown account");
  }

  public static async get(puuid: string) {
    const query = new Query().select("*").from(this.table).where({ puuid });

    return await executeQuery(query, "getAccount");
  }

  public static async getId(puuid: string) {
    return await getRowId(this.table, { puuid });
  }

  public static async exists(puuid: string) {
    return await isStored(this.table, { puuid });
  }

  public static async update(data: StoredAccount) {
    const query = new Query()
      .update(this.table)
      .set(convertDataForDB(data))
      .where({ puuid: data.puuid });

    await executeQuery(query, "updateAccount");
  }
}

export interface StoredAccount {
  puuid: string;
  name?: string;
  id?: string;
  summonerLevel?: number;
  level?: number;
  profileIconId?: number;
  rank?: string;
  grade?: string;
  tier?: string;
  lp?: number;
  games?: number;
  wins?: number;
}

function convertDataForDB(data: StoredAccount) {
  data.grade = data.rank;
  data.level = data.summonerLevel;

  delete data.rank;
  delete data.summonerLevel;
  delete data.id;

  return data as unknown as Record<string, string | number>;
}

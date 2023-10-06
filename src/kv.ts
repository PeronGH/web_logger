const kv = await Deno.openKv();

export type Log<T> = {
  timestamp: number;
  uuid: string;
  data: T;
};

export interface FunctionExecution {
  name: string;
  args: Record<string, string>;
  return?: string;
  source?: string;
}

export async function record(data: FunctionExecution) {
  const key = ["fn", Date.now(), crypto.randomUUID()];
  await kv.set(key, data);
}

export async function list(): Promise<Log<FunctionExecution>[]> {
  const logs: Log<FunctionExecution>[] = [];
  for await (
    const { key, value } of kv.list<FunctionExecution>(
      { prefix: ["fn"] },
      { reverse: true },
    )
  ) {
    const [type, timestamp, uuid] = key;
    if (
      type === "fn" &&
      typeof timestamp === "number" &&
      typeof uuid === "string"
    ) {
      logs.push({ timestamp, uuid, data: value });
    }
  }
  return logs;
}

import type { NextApiResponse } from "next";

export default function handler(res: NextApiResponse) {
  return res.send("OK");
}

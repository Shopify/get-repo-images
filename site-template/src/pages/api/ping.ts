import type { NextApiResponse } from "next";

export default function handler(req: NextApiResponse, res: NextApiResponse) {
  return res.send("OK");
}

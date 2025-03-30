const SECRET_KEY = process.env.SECRET_KEY || "";

export function withAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  const decodeKey = Buffer.from(apiKey, "base64").toString("utf-8");

  if (decodeKey === SECRET_KEY) {
    return next();
  }

  return res.status(401).send("Unauthorized");
}

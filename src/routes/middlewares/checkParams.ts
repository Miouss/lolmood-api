import { Request, Response, NextFunction } from "express";

export function checkParams(req: Request, _: Response, next: NextFunction) {
  try {
    const checkFctByPath: CheckFctByPath = {
      [Paths.account]: checkAccountPath,
      [Paths.matches]: checkMatchesPath,
    };
    console.log(req.route.path);
    checkFctByPath[req.route.path](req.params);

    next();
  } catch (err) {
    next(err);
  }
}

function checkAccountPath(params: Params) {
  if (params.summonerName === undefined) {
    throw new Error("Missing summonerName");
  }

  if (params.regionCode === undefined) {
    throw new Error("Missing region");
  }
}

function checkMatchesPath(params: Params) {
  if (params.regionCode === undefined) {
    throw new Error("Missing region");
  }

  if (params.puuid === undefined) {
    throw new Error("Missing matchId");
  }
}

interface CheckFctByPath {
  [key: string]: CheckFct;
}

type CheckFct = (params: Params) => void;
type Params = Record<string, string>;

enum Paths {
  "matches" = "/matches/:regionCode/:puuid",
  "account" = "/:regionCode/:summonerName",
}

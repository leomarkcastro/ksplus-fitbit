import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType } from "~/lib/rest/types";
import { FitbitAuthCallback } from "./lib/auth";
import { FitbitNutritionGet } from "./lib/nutrition";

const fitbitRouteDeclaration = new RouteDeclarationList({
  path: "/fitbit",
});

fitbitRouteDeclaration.routes.set(
  "/auth_redirect",
  new RouteDeclarationMetadata({
    inputParser: z.object({
      [RequestInputType.QUERY]: z.object({
        code: z.string(),
      }),
    }),
    func: async ({
      inputData: {
        [RequestInputType.QUERY]: { code },
      },
      res,
    }) => {
      const token = await FitbitAuthCallback({ code });

      res.status(200).send(token);
    },
  })
);

fitbitRouteDeclaration.routes.set(
  "/nutrition",
  new RouteDeclarationMetadata({
    func: async ({ res }) => {
      // start date at june 1, 2024 and end date at june 15, 2024
      const startDate = new Date(2024, 5, 1);
      const endDate = new Date(2024, 5, 15);
      const response = await FitbitNutritionGet({
        auth: {
          access_token:
            "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BKRloiLCJzdWIiOiJDM1lHQk0iLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNzE4NTQ5NzI4LCJpYXQiOjE3MTg1MjA5Mjh9.vVf-J5zCyMiNoNL3lMQbdcjgobh1SwfYKF9gyW8PMvA",
          expires_in: 28800,
          refresh_token:
            "09f1ce9658c99aa1db1a4a01388c2a3b21780fbcca897ad2d8b62fdd80dd09f7",
          scope: "nutrition weight sleep profile activity heartrate",
          token_type: "Bearer",
          user_id: "C3YGBM",
        },
        resource: "water",
        startDate: startDate,
        endDate: endDate,
      });

      res.status(200).send(response);
    },
  })
);

export { fitbitRouteDeclaration };

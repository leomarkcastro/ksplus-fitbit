import { z } from "zod";
import {
  RouteDeclarationList,
  RouteDeclarationMetadata,
} from "~/lib/rest/declarations";
import { RequestInputType } from "~/lib/rest/types";

const fitbitsubsRouteDeclaration = new RouteDeclarationList({
  path: "/fitbit-subs",
});

fitbitsubsRouteDeclaration.routes.set(
  "/subscription",
  new RouteDeclarationMetadata({
    inputParser: z.object({
      [RequestInputType.QUERY]: z.object({
        verify: z.string(),
      }),
    }),
    responsesTypes: [
      {
        code: 204,
        description: "204",
        content: z.object({
          message: z.string(),
        }),
      },
      {
        code: 404,
        description: "404",
        content: z.object({
          message: z.string(),
        }),
      },
    ],
    func: async ({
      inputData: {
        [RequestInputType.QUERY]: { verify },
      },
      res,
    }) => {
      if (verify === "correctVerificationCode") {
        res.status(204).send({
          message: "204",
        });
      } else if (verify === "incorrectVerificationCode") {
        res.status(404).send({
          message: "404",
        });
      } else {
        res.status(404).send({
          message: "404",
        });
      }
    },
  }),
);

export { fitbitsubsRouteDeclaration };

import { z } from "zod";
import {
  GraphqlActionMetadata,
  GraphqlMethodDeclarationList,
} from "~/lib/graphql/declarations";
import { FitbitAuthGenerateLink } from "./lib/auth";

const fitbitGQLDeclaration = new GraphqlMethodDeclarationList();

fitbitGQLDeclaration.add(
  new GraphqlActionMetadata({
    root: "Query",
    name: "Fitbit_Authorize",
    output: "String",
    description:
      "Authorize Fitbit. Prompt can accept ['none', 'login', 'consent', 'login consent']",
    input: z.object({
      prompt: z.string().default("none"),
      state: z.string().optional(),
    }),
    resolve: async (root, { prompt, state }) => {
      const url = await FitbitAuthGenerateLink({
        prompt,
        state,
      });

      return url.toString();
    },
  }),
);

export { fitbitGQLDeclaration };

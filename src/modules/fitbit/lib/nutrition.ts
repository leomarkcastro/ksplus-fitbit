import moment from "moment";
import { FitbitAuthorizationPayload, FitbitGetAccessToken } from "./auth";

export const FitbitNutritionGet = async (args: {
  auth: FitbitAuthorizationPayload;
  resource: "caloriesIn" | "water";
  startDate: Date;
  endDate: Date;
}) => {
  const tok = await FitbitGetAccessToken(args.auth);

  const stDateString = moment(args.startDate).format("YYYY-MM-DD");
  const endDateString = moment(args.endDate).format("YYYY-MM-DD");

  const tokenRequest = await fetch(
    `https://api.fitbit.com/1/user/-/foods/log/${args.resource}/date/${stDateString}/${endDateString}.json`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tok}`,
      },
    },
  );

  const token = await tokenRequest.json();

  return token;
};

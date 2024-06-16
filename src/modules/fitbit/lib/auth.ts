import { CONFIG } from "~/common/env";

export type FitbitAuthorizationPayload = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: string;
};

export const FitbitAuthCallback = async (args: {
  code: string;
}): Promise<FitbitAuthorizationPayload> => {
  const tokenRequest = await fetch("https://api.fitbit.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CONFIG.FITBIT_CLIENTID}:${CONFIG.FITBIT_CLIENTSECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      code: args.code,
      grant_type: "authorization_code",
      redirect_uri: CONFIG.FITBIT_REDIRECTURI,
    }),
  });

  const token = await tokenRequest.json();

  return token;
};

export const FitbitRefreshToken = async (args: {
  refresh_token: string;
}): Promise<FitbitAuthorizationPayload> => {
  const tokenRequest = await fetch("https://api.fitbit.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CONFIG.FITBIT_CLIENTID}:${CONFIG.FITBIT_CLIENTSECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      refresh_token: args.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const token = await tokenRequest.json();

  return token;
};

export const FitbitAuthGenerateLink = (args: {
  state?: string;
  prompt: string;
}) => {
  const url = new URL("https://www.fitbit.com/oauth2/authorize");
  url.searchParams.append("client_id", CONFIG.FITBIT_CLIENTID);
  url.searchParams.append(
    "scope",
    "activity heartrate nutrition profile sleep weight"
  );
  // url.searchParams.append("code_challenge", codeChallenge);
  // url.searchParams.append("code_challenge_method", "S256");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("prompt", args.prompt);
  if (args.state) {
    url.searchParams.append("state", args.state);
  }

  return url.toString();
};

export const FitbitAuthGetProfile = async (args: {
  accessToken: string;
}): Promise<any> => {
  const profileRequest = await fetch(
    "https://api.fitbit.com/1/user/-/profile.json",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
      },
    }
  );

  const profile = await profileRequest.json();

  return profile;
};

export const FitbitGetAccessToken = async (
  args: FitbitAuthorizationPayload
): Promise<string> => {
  try {
    await FitbitAuthGetProfile({
      accessToken: args.access_token,
    });

    return args.access_token;
  } catch (e: any) {
    if (e.status === 401) {
      const token = await FitbitRefreshToken({
        refresh_token: args.refresh_token,
      });

      return token.access_token;
    } else {
      throw e;
    }
  }
};

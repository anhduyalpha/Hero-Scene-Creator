import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const GH_GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
  query ContributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

router.get("/github/contributions", async (req, res) => {
  const token = process.env["GITHUB_TOKEN"];
  if (!token) {
    res.status(503).json({ error: "GitHub token not configured" });
    return;
  }

  const username = "anhduyalpha";
  const cacheKey = `contributions:${username}`;
  const now = Date.now();

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    res.json(cached.data);
    return;
  }

  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  try {
    const response = await fetch(GH_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "AlphaD-Portfolio/1.0",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username, from: from.toISOString(), to: to.toISOString() },
      }),
    });

    if (!response.ok) {
      req.log.error({ status: response.status }, "GitHub API error");
      res.status(502).json({ error: "GitHub API unavailable" });
      return;
    }

    const json = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions: number;
              weeks: Week[];
            };
          };
        };
      };
      errors?: { message: string }[];
    };

    if (json.errors?.length) {
      req.log.error({ errors: json.errors }, "GitHub GraphQL errors");
      res.status(502).json({ error: "GitHub GraphQL error" });
      return;
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      res.status(404).json({ error: "User not found or no contribution data" });
      return;
    }

    const result = {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((w) => ({
        days: w.contributionDays.map((d) => ({
          count: d.contributionCount,
          date: d.date,
        })),
      })),
    };

    cache.set(cacheKey, { data: result, expiresAt: now + CACHE_TTL_MS });
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch GitHub contributions");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;

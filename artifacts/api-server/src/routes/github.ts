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

const PINNED_QUERY = `
  query PinnedRepos($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            isPrivate
            updatedAt
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 5) {
              nodes {
                topic { name }
              }
            }
          }
        }
      }
    }
  }
`;

router.get("/github/pinned", async (req, res) => {
  const token = process.env["GITHUB_TOKEN"];
  if (!token) {
    res.status(503).json({ error: "GitHub token not configured" });
    return;
  }

  const username = "anhduyalpha";
  const cacheKey = `pinned:${username}`;
  const now = Date.now();

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    res.json(cached.data);
    return;
  }

  try {
    const response = await fetch(GH_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "AlphaD-Portfolio/1.0",
      },
      body: JSON.stringify({ query: PINNED_QUERY, variables: { username } }),
    });

    if (!response.ok) {
      req.log.error({ status: response.status }, "GitHub API error");
      res.status(502).json({ error: "GitHub API unavailable" });
      return;
    }

    const json = (await response.json()) as {
      data?: {
        user?: {
          pinnedItems?: {
            nodes: {
              name: string;
              description: string | null;
              url: string;
              stargazerCount: number;
              forkCount: number;
              isPrivate: boolean;
              updatedAt: string;
              primaryLanguage: { name: string; color: string } | null;
              repositoryTopics: { nodes: { topic: { name: string } }[] };
            }[];
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

    const nodes = json.data?.user?.pinnedItems?.nodes ?? [];
    let result = nodes.map((n) => ({
      name: n.name,
      description: n.description ?? "",
      url: n.url,
      stars: n.stargazerCount,
      forks: n.forkCount,
      language: n.primaryLanguage ?? null,
      topics: n.repositoryTopics.nodes.map((t) => t.topic.name),
      updatedAt: n.updatedAt,
    }));

    if (result.length === 0) {
      const restRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=pushed&per_page=6&type=public`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "AlphaD-Portfolio/1.0",
            Accept: "application/vnd.github+json",
          },
        }
      );
      if (restRes.ok) {
        const repos = (await restRes.json()) as {
          name: string;
          description: string | null;
          html_url: string;
          stargazers_count: number;
          forks_count: number;
          language: string | null;
          topics: string[];
          pushed_at: string;
        }[];

        const LANG_COLORS: Record<string, string> = {
          TypeScript: "#3178c6", JavaScript: "#f1e05a", Go: "#00ADD8",
          Rust: "#dea584", Python: "#3572A5", CSS: "#563d7c",
          HTML: "#e34c26", "C++": "#f34b7d", Java: "#b07219",
          Vue: "#41b883", Svelte: "#ff3e00",
        };

        result = repos.map((r) => ({
          name: r.name,
          description: r.description ?? "",
          url: r.html_url,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language
            ? { name: r.language, color: LANG_COLORS[r.language] ?? "#f59e0b" }
            : null,
          topics: r.topics ?? [],
          updatedAt: r.pushed_at,
        }));
      }
    }

    cache.set(cacheKey, { data: result, expiresAt: now + CACHE_TTL_MS });
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch GitHub pinned repos");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/github/latest-commit", async (req, res) => {
  const token = process.env["GITHUB_TOKEN"];
  if (!token) {
    res.status(503).json({ error: "GitHub token not configured" });
    return;
  }

  const username = "anhduyalpha";
  const cacheKey = `latest-commit:${username}`;
  const now = Date.now();
  const FIVE_MIN = 5 * 60 * 1000;

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    res.json(cached.data);
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "AlphaD-Portfolio/1.0",
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      req.log.error({ status: response.status }, "GitHub events API error");
      res.status(502).json({ error: "GitHub API unavailable" });
      return;
    }

    const events = (await response.json()) as {
      type: string;
      repo: { name: string };
      payload: { commits?: { message: string; sha?: string }[] };
      created_at: string;
    }[];

    const push = events.find(
      (e) => e.type === "PushEvent" && e.payload.commits?.length
    );

    if (!push) {
      res.json(null);
      return;
    }

    const commit = push.payload.commits![push.payload.commits!.length - 1];
    const repoShort = push.repo.name.replace(`${username}/`, "");
    const result = {
      message: commit.message.split("\n")[0].slice(0, 80),
      repo: repoShort,
      url: `https://github.com/${push.repo.name}`,
      timestamp: push.created_at,
    };

    cache.set(cacheKey, { data: result, expiresAt: now + FIVE_MIN });
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch GitHub events");
    res.status(500).json({ error: "Internal error" });
  }
});

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

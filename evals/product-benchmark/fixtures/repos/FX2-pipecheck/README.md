# Pipecheck

Pipecheck lints deployment pipeline files before they fail at 2 AM. It
reads a 200-line YAML workflow, checks 14 rules, and reports in about
2 seconds — as a CLI or as 1 GitHub PR comment.

## Why

A survey of 120 workflows across 30 repositories found 90 issues in
45 files: missing `actions/checkout@v4` (22 cases), mixed Node 18 and
Node 20 jobs (17 cases), and 3 kinds of secret-name typos (31 cases).
The remaining 20 were 1-off mistakes no rule catches yet.

## Install

```sh
npm install -g pipecheck@1.1.0
pipecheck --init   # writes 1 config file, 25 lines
```

Needs Node 20+. Supports monorepos with up to 5 packages (pnpm, npm,
and yarn workspaces). Open-source projects are free; teams pay $8 per
developer per month.

## Rules

14 rules in 3 groups:

- Correctness (6 rules): missing checkout, unknown action versions,
  unpinned SHAs, dangling `needs:` refs, empty jobs, duplicate job ids.
- Consistency (5 rules): mixed Node majors, mixed runners, secret-name
  typos (3 patterns), inconsistent timeouts, drifted reusable workflows.
- Cost (3 rules): missing concurrency cancel, cache misses on 2 or more
  jobs, matrix explosions over 24 combinations.

Each rule page shows 2 examples (bad vs fixed) and the average fix time:
10 minutes across the beta.

## Beta results

30 repositories, 120 workflows scanned, 90 issues found, 4 percent false
positives. 7 teams fixed all findings within 3 days; the other 2 needed
a 2nd pass. 0 crashes on files up to 800 lines; files past 800 lines get
a warning and a partial result (first 800 lines only).

## Config

25 lines of YAML: enable/disable any of the 14 rules, set timeout bounds
(5 to 60 minutes), pin the 3 allowed runner labels. Strict mode turns the
5 consistency rules into errors. 1 command (`pipecheck --explain R07`)
prints the rationale for any rule.

## Limits (honest)

- GitHub Actions only; GitLab support is issue #42, not started.
- 4 percent false positives, concentrated in 2 rules (R06 unpinned SHAs
  on internal actions, R11 cache keys with 3+ variables).
- 800-line ceiling per file; monorepos over 5 packages need 2 config files.

## Roadmap

Version 1.2.0 plans 2 items: autofix for the 6 correctness rules (1 flag,
`--fix`, with a diff preview) and SARIF output so the 90 beta findings
replay in any of the 5 tested code-scanning dashboards.

## License

Apache-2.0. 3 maintainers, 22 contributors, 96 closed issues.

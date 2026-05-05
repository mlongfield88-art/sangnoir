# Security Policy

Sangnoir takes security seriously. This document explains how to report a vulnerability you find in any of our public properties.

## Reporting a vulnerability

Email **myles@lxsixty.com** with a clear description of the issue, the affected URL or component, and steps to reproduce.

Please **do not** open a public GitHub issue for security findings. Email gets a faster, more confidential response.

## Scope

This policy covers the public-facing `sangnoir.co.uk` site and its Cloudflare Pages build at `sangnoir.pages.dev`.

Out of scope:

- Operational systems (internal Sangnoir tooling)
- Third-party services we depend on (Cloudflare Pages, GitHub, our hosting providers, Google Workspace)
- Brute-force attacks against authentication systems
- Findings from automated scanners that haven't been verified to be exploitable

## What to expect

- Acknowledgement within 3 working days
- Assessment and remediation timeline within 10 working days for confirmed vulnerabilities

## Safe harbour

Good-faith security research conducted within the scope above will not result in legal action. Avoid:

- Privacy violations (do not access, modify, or destroy data that is not yours)
- Service disruption (no DoS testing)
- Social engineering of staff
- Physical security testing

## Out-of-band contact

For RFC 9116 compliant tooling: `https://sangnoir.co.uk/.well-known/security.txt`

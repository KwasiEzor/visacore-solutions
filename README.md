# visacore-solutions
Site vitrine pour une agence d'immigration légale avec suivi et accompagnement dans les procédures

## CAPTCHA

Le projet prend en charge Cloudflare Turnstile sur les formulaires publics de contact et d'évaluation.

Variables d'environnement requises pour activer la protection :

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` ou `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Sans ces variables, les formulaires continuent de fonctionner avec les garde-fous existants, mais le widget CAPTCHA ne s'affiche pas.

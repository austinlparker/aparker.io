# aparker.io on atproto

This is the source code for my blog, [aparker.io](https://aparker.io).

Heavily inspired by [blug](https://github.com/haileyok/blug) by [haileyok.com](https://bsky.app/profile/haileyok.com), this blog leverages [atproto](https://atproto.com/) as its data store.

It is currently a ✨ work in progress ✨.

## Status

- [X] Map rkeys to human-readable strings in the route
- [X] Build an admin interface, including composer and basic CRUD operations.
- [X] RSS Feed Support
- [ ] Add auth to the admin routes.
- [X] Add support for uploading images
- [ ] Add support for uploading/embedding videos
- [ ] Caching and url rewrite for blob uploads
- [ ] Generic blob file support (e.g., gists/dotfiles)
- [X] Add support for comments as replies/interactions on atproto links.
- [ ] Add tagging/filtering support (may require lexicon rewrite)
- [ ] Maybe factor out the theme/css so that people could use this as a template?
- [ ] Add OpenTelemetry support (tracing, metrics, events)

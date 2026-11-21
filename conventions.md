# Conventions

The one pattern this project follows. If the code and this file disagree, fix one of them.

## Language and style

- Everything in English: code, names, comments, commits, README, issues.
- Comments, commit messages and log strings are lowercase, except class, function and variable names (`resizeToWindow`).
- Comments are a person's notes, not documentation: one line, plain English, only for a trap or a why the code doesn't show (`// changing aspect does nothing until you call this`). Never what the code does; no textbook explanations, numbers, spec quotes or emoji.
- Tone follows complexity: a quick note for simple things, a more precise sentence for complex ones.
- Naming: `PascalCase` for classes, `camelCase` for functions and variables, `UPPER_SNAKE_CASE` only for fixed literal values at module level (numbers, strings, colours: `CAMERA_FOV`). Objects created with `new` stay `camelCase` even when `const` (`renderer`, not `RENDERER`).
- File names: lowercase `kebab-case` (`follow-camera.js`).

## Code shape

- Plain ES modules. One file, one responsibility; keep files short.
- Folders by feature (`core/`, `world/`, `player/`, `ui/`, `content/`), one level deep, no barrel `index.js`.
- `main.js` is the only place that wires modules together; dependencies are passed to constructors. No singletons, no service locator.
- One loop. Everything that changes over time exposes `update(dt)` and is registered in a single ordered `updatables` list in `main.js`.
- No magic numbers or strings: a value whose meaning is not obvious gets a named constant at the top of the module that uses it (`CAMERA_FOV`). Obvious values (`0` as origin, `/ 2` to halve) stay inline. No shared `constants.js`: a value needed elsewhere is exported by the module that owns it.
- Game objects are plain classes that own an `Object3D` (`this.root`); they never `extends Object3D`.
- Distant systems (world and ui) talk through one shared `EventTarget` (`events.js`); inside a feature, direct calls. Event names (`place:enter`) are constants exported by `events.js`, so a typo becomes an import error.

## Dependencies and assets

- Runtime dependencies: `three` only. A new dependency needs a reason in its commit message.
- `three` is pinned to an exact version; an upgrade is its own commit, after reading the migration guide.
- Import the `three` core as `import * as THREE from 'three'`; addons by name from the full path with `.js` (`three/addons/loaders/GLTFLoader.js`), never from the `three/addons` barrel.
- Only optimised assets go in the repo; raw sources stay out. Every asset has a known source and licence.
- No real brands, logos or protected characters in shipped assets.

## Commits

- Subject: `[type] subject`, lowercase, at most 72 characters (`[add] follow camera damping`). A body only to explain why.
- Types: `add`, `update`, `fix`, `delete`, `feat`, `refactor`, `docs`, `chore`.
- One logical change per commit. No trailers.

## Branches

- One branch per topic, named `type/topic` with the commit types, lowercase kebab-case (`feat/minimal-scene`).
- `main` only moves by fast-forward: rebase the branch on `main` if needed, then `git merge --ff-only`. No merge commits.
- Delete the branch once merged.

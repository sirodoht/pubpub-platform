# Quick Install

Built using node `v18.16.0` (captured in `/.nvmrc`). Use [nvm](https://github.com/nvm-sh/nvm) to ensure you're using at least `18.16.0` before installing to avoid inconsistencies at the node level. 

Local development requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) to be installed and running on your machine.

Begin by making sure Docker Desktop is running. Then, `cd` to this repo in your terminal and run the following commands. A few of them have interactive prompts you'll need to act on, so I suggest running them one-by-one.

```
npm install
npx supabase login
npx supabase start
npx supabase db reset
cp .env.template .env.local
```

Copy the relevant values output from `supabase start` into `.env.local`.

Populate the database by running:

```
npm run reset
```

Choose yes on prompted questions.

Start the dev server with

```
npm run dev
```

# Running

After install you can start the dev server with

```
npm run dev
```

If Supabase isn't running, be sure to run

```
npx supabase start
```

Supabase can be stopped using

```
npx supabase stop
```

Stopping supabase will erase the database. You will need to re-seed the database each time you run `npx supabase start` by running:

```
npx supabase db reset // Rebuilds the postgres DB with necessary functions and triggers.
npm run reset // Rebuils and applies the prisma schema and creates seed content.
```

If you wish to avoid this, you can preserve the database until next time by instead using

```
supabase stop --backup
```

# Code Setup

## Prettier

I've found much more success using prettier than ESLint on teams. Don't bring your own opinions, just auto-format (either on save, or on commit), and let the simple .prettierrc hold the small subset of decisions.

Really nice to bind `Format Document` to a familiar keyboard shortcut so you can format the doc as you go (similar to format-on-save and then saving frequently).

## Git Hooks
Two hooks are defined in the package.json `gitHooks` field, which are executed by `yorkie`.
- The first runs Prettier on commit
- The second runs a type-check before pushing. Since our deployment setup builds on each push, the intent here is to not trigger a build with known type errors.

Sometimes you want to push up changes even though there is a type error. To do so, include `--no-verify` at the end of your command. For example: `git push origin main --no-verify`.

## Chakra

To use NextJS's app directory (which uses server and client components), we follow the instructions on [Chakra's NextJS Guide](https://chakra-ui.com/getting-started/nextjs-guide#app-directory-setup). I don't actually use Chakra in this mockup so far, but I got it setup to make sure it would work.

## Supabase

To speed development, we run Supabase locally. [These instructions](https://supabase.com/docs/guides/getting-started/local-development) were followed to get an initial config in place. Please review them so you understand how it's working.

After running `npx supabase start` the Supabase dashboard is accessible at `http://localhost:54323`

## Prisma

The Prisma [Quickstart guide](https://www.prisma.io/docs/getting-started/quickstart) is how our prisma folder was initially created. That set of instructions has useful pointers for doing things like db migrations.

The `db/seed.ts` file will initiate the database with a set of data. This seed is run using `npm run reset`. You will have to run this each time you stop and start supabase since doing so clears the database.

Explore with `npm run prisma studio`.

## Folder structure
-   `/app` The Next.JS [app directory](https://nextjs.org/docs/app/building-your-application/routing).
-   `/lib` Functions that are re-used in multiple locations throughout the codebase. Akin to a `/utils` folder.
-   `/prisma` Config and functions for using Prisma
-   `/public` Static files that will be publicly available at `https://[URL]/<filename>`.
-   `/supabase` Files generated for use when running Supabase locally. Likely won't have to touch anything in here, with the exception of `seed.sql` which has been edited to support our Authentication setup, as described below.

## Authentication
We use Supabase as our authentication provider. This gives us easy access to SSO providers (e.g. Github, Google, etc) and helpful functions (e.g. send invite email, reset password, etc).

Supabase manages users in a separate authentication postgres schema. We don't want to be messing with the supabase-managed schema, so we create a parallel `Users` table on the `public` (i.e. default) postgres schema. This `public.Users` table does not store any password, hash, or other auth-specific information. It only stores data that we may need on the application side (e.g. name and avatar for display, or email address so that we can send notifications). Likewise, we don't want any application-specific information being stored on the `auth` schema or managed by supabase. Supabase offers to provide this with a `metadata` object they'll track and return to you, but that would then require us to go through supabase auth everytime we want any user data (e.g. searching for users to add as a Member).

However, we do need our Users table to remain in sync with any data added or edited in the `auth` schema - specifically, the user's email address. On signup we take this email address from the form and submit it both to Supabase auth and to our Users table. However, the user can edit this email through Supabase-only functions that our backend wouldn't know about. To handle this scenario, we create a [Function and Trigger](https://supabase.com/docs/guides/database/functions) (stored in `/supabase/seed.sql`). Note, this is a just a plain Postgres SQL function, not a Supabase Edge Function.

The `/supabase/seed.sql` file has been edited to specify a function and trigger. After running `npx supabase db reset`, you should be able use the Dashboard to navigate to the Database > Functions or Database > Triggers tab and see `handle_updated_user` and `on_user_update` respectively.

These instructions hold for using email signup (where their email is entered directly into a form). For 3rd party SSO signup, we will probably need an additional function and trigger to handle user_created events.

## Note on `encoding`
An irrelevant warning is thrown (sometimes multiple times) on every page load in dev due to [this bug](https://github.com/supabase/supabase-js/issues/612). Installing `npm i -D encoding` resolves the issue for now, but once that issue above is fixed, we can uninstall that package from our top-level dev dependencies.
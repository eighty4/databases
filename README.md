# @eighty4/databases

A JavaScript library for managing local development databases.

## Dev workflows

### Running locally from source

Chaining the `build` and `dev` scripts will run from local source via the CLI entrypoint. 

```shell
pnpm build && pnpm dev -h
```

### Verifying code changes

The `ci_verify.sh` script will verify code changes as CI builds would. 

```shell
./ci_verify.sh
```

### Interactive update with `pnpm`

The update command can be used interactively and recursively to upgrade project dependencies:

```shell
pnpm update --interactive --latest --recursive
```

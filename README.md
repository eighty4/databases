# @eighty4/databases

A JavaScript library for managing local development databases.

## Dev workflows

### Verifying code changes

The `ci_verify.sh` script will verify code changes as CI builds would. 

```bash
./ci_verify.sh
```

### Interactive update with `pnpm`

The update command can be used interactively and recursively to upgrade project dependencies:

```bash
pnpm update --interactive --latest --recursive
```

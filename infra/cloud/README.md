# infra/cloud

Terraform for the AWS resources behind the platform. LocalStack stands in for
AWS when testing locally.

## Layout

| Path | What it holds |
|---|---|
| `modules/` | One module per concern |
| `envs/local` | The modules against LocalStack, with disposable local state |
| `envs/dev` | The shared dev environment in `sa-east-1`, with state in S3 |
| `bootstrap` | The S3 bucket for remote state, one workspace per account |

Each environment is its own root, so provider and backend differ without
conditionals. A new environment is a new directory calling the same modules.

## Local

Needs LocalStack Pro running on `localhost:4566`; some services used here are
not in the community image.

```bash
cd envs/local
terraform init
terraform apply
```

LocalStack keeps nothing across restarts. When the container restarts, delete
`terraform.tfstate` and apply again.

## Dev

Every developer points at this environment. Using it needs only the outputs,
handed over privately; no AWS credentials involved. Applying it does need
them.

Both `bootstrap` and `envs/dev` take the target account ID and refuse to run
against any other, so the wrong active profile fails instead of creating
resources in the wrong account. The ID stays out of the repo, in gitignored
`.tfvars` files.

Terraform reads credentials from the active AWS profile. With IAM Identity
Center, sign in first; the session lasts a few hours:

```bash
aws sso login --profile ecoa-dev
export AWS_PROFILE=ecoa-dev
aws sts get-caller-identity   # must show the dev account
```

First the state bucket, once per account. The code is the same for every
account, so each one gets a workspace and its own local state under
`terraform.tfstate.d/`. Applying in the `default` workspace is refused.

```bash
cd bootstrap
cp account.tfvars.example dev.tfvars
terraform init
terraform workspace new dev
terraform apply -var-file=dev.tfvars
```

Then the environment. The bucket is named `ecoa-tfstate-<account_id>`:

```bash
cd ../envs/dev
cp terraform.tfvars.example terraform.tfvars
terraform init -backend-config="bucket=ecoa-tfstate-<account_id>"
terraform apply
```

Every developer holds the same Cognito client secret. When someone leaves the
team, replace the client, which issues a new ID and secret, and hand the new
values out again:

```bash
terraform apply -replace=module.cognito.aws_cognito_user_pool_client.backend
```

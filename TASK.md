# Update CronJob schema

## Tasks

- [x] `cronExpression` should be `expression`
- [x] `status` should removed - only need `enable`
- [x] `lastRunAt` and `nextRunAt` and `lastError` should removed
- [ ]

## Tasks 02 - assertValidCronExpression should in DTO

- [x] Build custom Dto validator `IsCronExpression`
- [x] Instead using `assertValidCronExpression`, then using `IsCronExpression`
- [x] `IsCronExpression` should using for global nextjs

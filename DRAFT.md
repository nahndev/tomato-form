# Add new action - SendMail

## Tasks

- [ ] Add action `SendMailAction` to send mail to user
- [ ] The `SendMailAction` will send `mail` base on `content` when job running.
- [ ] The `MailService` should is `mockup` and only write to logging.
- [ ] The `MailService` should is shared service for nextjs.

- [ ] Add new UI for `SendMailActionCard` include `RecipientEditor` and `ContentEditor`
- [ ] `RecipientEditor` with multiple line, every line include 2 column `type` and `value`
- [ ] `type` is `RecipientType` include `mail` and `user`
- [ ] With `mail` should `input` to enter mail
- [ ] With `user` should `selector` to select user
- [ ] `ContentEditor` include `subject` and `mail`.

## Approval rules

- Should wrap code of `send-mail-action` to folder.
- Should

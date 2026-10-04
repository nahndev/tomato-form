import { UserService } from "@/user/user.service";
import { MappingContext, USER_REFERENCE_WIDGET_TYPES } from "@/widget-value";
import { Injectable } from "@nestjs/common";

/** Fills in the parts of a `MappingContext` that need I/O so a context can be built empty and loaded afterwards: currently the users (uuid -> name) that `users`/`submitted-by` widgets resolve against, looked up only when one of the context's widgets references them. */
@Injectable()
export class MappingContextLoader {
  constructor(private readonly userService: UserService) {}

  async load(context: MappingContext): Promise<void> {
    if (!context.getWidgets().some((widget) => USER_REFERENCE_WIDGET_TYPES.includes(widget.type))) return;

    const users = await this.userService.findAll();
    context.setUsers(new Map(users.map((user) => [user.uuid, user.name])));
  }
}

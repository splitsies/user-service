import schema from "./schema";
import { handlerPath } from "../../libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 60,
    events: [
        {
            http: {
                method: "post",
                path: "users",
                request: {
                    schemas: {
                        "application/json": schema,
                    },
                },
            },
        },
    ],
};

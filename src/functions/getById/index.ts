import schema from "./schema";
import { handlerPath } from "../../libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 60,
    events: [
        {
            http: {
                method: "get",
                path: "users/{id}",
                request: {
                    parameters: {
                        paths: {
                            id: true,
                        },
                    },
                    schemas: {
                        "application/json": schema,
                    },
                },
            },
        },
    ],
};

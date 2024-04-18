import { handlerPath } from "../../libs/handler-resolver";

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 60,
    events: [
        {
            http: {
                method: "delete",
                path: "users/{id}",
            },
        },
    ],
};

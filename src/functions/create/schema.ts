export default {
    type: "object",
    properties: {
        user: {
            type: "object",
            properties: {
                givenName: { type: "string" },
                username: { type: "string" },
                password: { type: "string" },
                familyName: { type: "string" },
                email: { type: "string" },
                phoneNumber: { type: "string" },
                dateOfBirth: { type: "string" },
                middleName: { type: "string" },
            },
            required: ["username", "password", "givenName", "familyName", "email"],
        },
    },
} as const;

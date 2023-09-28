export default {
    type: "object",
    properties: {
        user: {
            type: "object",
            properties: {
                givenName: { type: "string" },
                password: { type: "string" },
                familyName: { type: "string" },
                email: { type: "string" },
                phoneNumber: { type: "string" },
                dateOfBirth: { type: "string" },
                middleName: { type: "string" },
            },
            required: ["password", "givenName", "familyName", "email", "phoneNumber", "dateOfBirth"],
        },
    },
} as const;

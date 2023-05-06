export default {
    type: "object",
    properties: {
        user: {
            type: "object",
            properties: {
                id: { type: "string" },
                givenName: { type: "string" },
                familyName: { type: "string" },
                email: { type: "string" },
                phoneNumber: { type: "string" },
                dateOfBirth: { type: "string" },
                middleName: { type: "string" },
            },
            required: ["id", "givenName", "familyName", "email", "phoneNumber", "dateOfBirth", "middleName"],
        },
    },
} as const;

export default {
    type: "object",
    properties: {
        givenName: { type: "string" },
        familyName: { type: "string" },
        phoneNumber: { type: "string" },
    },
    required: ["givenName", "familyName", "phoneNumber"],
} as const;

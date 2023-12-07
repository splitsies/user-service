export default {
    type: "object",
    properties: {
        givenName: { type: "string" },
        famiylName: { type: "string" },
    },
    required: ["givenName", "familyName"],
} as const;

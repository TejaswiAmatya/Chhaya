import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MannSathi — Meri Katha API",
      version: "1.0.0",
      description:
        "Nepali women ko kathaharuko lagi API. Share, sunein, support — anonymously.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local dev server",
      },
    ],
    components: {
      schemas: {
        Story: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "clxyz123abc",
              description: "Unique ID (cuid)",
            },
            content: {
              type: "string",
              minLength: 10,
              maxLength: 500,
              example: "Aaja din ekdum tuff thiyo yaar, koi sunney thiyena...",
            },
            suneinCount: {
              type: "integer",
              example: 12,
              description: "Kitna janale sune — sunein count",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-28T10:00:00.000Z",
            },
          },
          required: ["id", "content", "suneinCount", "createdAt"],
        },
        StoryInput: {
          type: "object",
          properties: {
            content: {
              type: "string",
              minLength: 10,
              maxLength: 500,
              example: "Ghar ma koi bujhdaina, tara yeha bhanna paauchu...",
            },
          },
          required: ["content"],
        },
        ApiResponse: {
          type: "object",
          description: "Standard response shape for all endpoints",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              description: "Response payload — null on error",
            },
            error: {
              type: "string",
              description: "Present only when success is false",
              example: "Kei bhayo yaar, feri try garna hai",
            },
          },
          required: ["success", "data"],
        },
      },
    },
  },
  apis: ["./routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
